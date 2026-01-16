import { Database, ref, set, onValue, off, type DatabaseReference, serverTimestamp, onDisconnect } from 'firebase/database';
import type { IPhysicsState } from '../game/physics';

export interface RemotePlayerState extends IPhysicsState {
    timestamp: number;
    finished?: boolean;
    finishTime?: number | object; // object when writing serverTimestamp
    connected?: boolean;
}

export interface RemotePlayer {
    uid: string;
    currentState: RemotePlayerState;
    previousState: RemotePlayerState;
    lastUpdateTime: number;
}

export class SyncManager {
    private database: Database;
    private roomId: string | null = null;
    private userId: string | null = null;
    private remotePlayers: Map<string, RemotePlayer> = new Map();
    private listeners: DatabaseReference[] = [];
    private connectedRef: DatabaseReference | null = null;

    // Throttling
    private lastSyncTime: number = 0;
    private readonly SYNC_INTERVAL_MS = 200; // 5Hz

    constructor(database: Database) {
        this.database = database;
    }

    /**
     * Start syncing for a specific room and user
     */
    public startSync(roomId: string, userId: string): void {
        this.roomId = roomId;
        this.userId = userId;
        this.remotePlayers.clear();

        // Listen for connection state changes
        this.connectedRef = ref(this.database, '.info/connected');
        onValue(this.connectedRef, (snapshot) => {
            if (snapshot.val() === true && this.roomId && this.userId) {
                const userStateRef = ref(this.database, `rooms/${this.roomId}/players/${this.userId}/state`);

                // When we disconnect, update the connected status to false
                onDisconnect(userStateRef).update({
                    connected: false
                }).then(() => {
                    // Update connected status to true on connect
                    // We merge this with existing state writing if we triggered a write recently, 
                    // but it's safer to just set it here or rely on writeLocalState
                });
            }
        });

        // Listen to all players in the room
        this.listenToPlayers();
    }

    /**
     * Stop syncing and clean up listeners
     */
    public stopSync(): void {
        // Clean up all Firebase listeners
        this.listeners.forEach(listenerRef => {
            off(listenerRef);
        });

        if (this.connectedRef) {
            off(this.connectedRef);
            this.connectedRef = null;
        }

        if (this.roomId && this.userId) {
            const userStateRef = ref(this.database, `rooms/${this.roomId}/players/${this.userId}/state`);
            onDisconnect(userStateRef).cancel();
        }

        this.listeners = [];
        this.remotePlayers.clear();
        this.roomId = null;
        this.userId = null;
    }

    /**
     * Write local physics state to Firebase (throttled)
     */
    public writeLocalState(state: IPhysicsState): void {
        if (!this.roomId || !this.userId) {
            console.warn('SyncManager: Cannot write state - not initialized');
            return;
        }

        if (!this.shouldSync()) {
            return; // Throttled
        }

        const stateRef = ref(this.database, `rooms/${this.roomId}/players/${this.userId}/state`);
        const roundedState = {
            pos: this.round3(state.pos),
            vel: this.round3(state.vel),
            acc: this.round3(state.acc),
            jerk: this.round3(state.jerk),
            timestamp: serverTimestamp(), // Use server timestamp for fairness
            connected: true
        };

        set(stateRef, roundedState).catch(err => {
            console.error('SyncManager: Failed to write state', err);
        });
    }

    /**
     * Send race finish event with authoritative server timestamp
     */
    public sendRaceFinish(state: IPhysicsState): void {
        if (!this.roomId || !this.userId) return;

        const stateRef = ref(this.database, `rooms/${this.roomId}/players/${this.userId}/state`);
        const finishState = {
            pos: this.round3(state.pos),
            vel: this.round3(state.vel),
            acc: this.round3(state.acc),
            jerk: this.round3(state.jerk),
            timestamp: serverTimestamp(),
            finished: true,
            finishTime: serverTimestamp(), // Authoritative finish time
            connected: true
        };

        // Force write immediately, bypassing throttle
        set(stateRef, finishState).catch(err => {
            console.error('SyncManager: Failed to write finish state', err);
        });
    }

    /**
     * Update remote player state (called by Firebase listener)
     */
    public updateRemotePlayer(uid: string, state: RemotePlayerState): void {
        // Don't track own state as remote
        if (uid === this.userId) {
            return;
        }

        const existing = this.remotePlayers.get(uid);

        if (existing) {
            // Update existing player
            this.remotePlayers.set(uid, {
                uid,
                previousState: existing.currentState,
                currentState: state,
                lastUpdateTime: Date.now(),
            });
        } else {
            // New remote player
            this.remotePlayers.set(uid, {
                uid,
                previousState: state,
                currentState: state,
                lastUpdateTime: Date.now(),
            });
        }
    }

    /**
     * Get interpolated state for a remote player
     */
    public getInterpolatedState(uid: string, currentTime?: number): RemotePlayerState {
        const player = this.remotePlayers.get(uid);
        if (!player) {
            return { pos: 0, vel: 0, acc: 0, jerk: 0, timestamp: 0 };
        }

        const now = currentTime ?? Date.now();
        const timeSinceUpdate = now - player.lastUpdateTime;
        const interpolationWindow = this.SYNC_INTERVAL_MS;

        // Calculate interpolation factor (0 to 1)
        const t = Math.min(timeSinceUpdate / interpolationWindow, 1);

        // Linear interpolation (lerp) for position
        const interpolatedPos = this.lerp(player.previousState.pos, player.currentState.pos, t);

        return {
            pos: interpolatedPos,
            vel: player.currentState.vel,
            acc: player.currentState.acc,
            jerk: player.currentState.jerk,
            timestamp: player.currentState.timestamp,
            connected: player.currentState.connected // Pass connection status
        };
    }

    /**
     * Get all remote players for rendering
     */
    public getRemotePlayers(): RemotePlayer[] {
        return Array.from(this.remotePlayers.values());
    }

    /**
     * Listen to all players in the room
     */
    private listenToPlayers(): void {
        if (!this.roomId) return;

        const playersRef = ref(this.database, `rooms/${this.roomId}/players`);
        this.listeners.push(playersRef);

        onValue(playersRef, (snapshot) => {
            if (!snapshot.exists()) return;

            const players = snapshot.val();
            Object.keys(players).forEach(uid => {
                if (uid !== this.userId) {
                    // Listen to each remote player's state
                    this.listenToPlayerState(uid);
                }
            });
        });
    }

    /**
     * Listen to a specific player's state updates
     */
    private listenToPlayerState(uid: string): void {
        if (!this.roomId) return;

        const stateRef = ref(this.database, `rooms/${this.roomId}/players/${uid}/state`);
        this.listeners.push(stateRef);

        onValue(stateRef, (snapshot) => {
            if (!snapshot.exists()) return;

            const state = snapshot.val() as RemotePlayerState;
            this.updateRemotePlayer(uid, state);
        });
    }

    /**
     * Check if enough time has passed to sync again (throttling)
     */
    private shouldSync(): boolean {
        const now = Date.now();
        if (now - this.lastSyncTime >= this.SYNC_INTERVAL_MS) {
            this.lastSyncTime = now;
            return true;
        }
        return false;
    }

    /**
     * Linear interpolation
     */
    private lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    /**
     * Round to 3 decimal places
     */
    private round3(value: number): number {
        return Math.round(value * 1000) / 1000;
    }
}
