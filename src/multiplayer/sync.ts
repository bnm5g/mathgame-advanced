import { Database, ref, set, onValue, off, type DatabaseReference } from 'firebase/database';
import type { IPhysicsState } from '../game/physics';

export interface RemotePlayerState extends IPhysicsState {
    timestamp: number;
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
            timestamp: Date.now(),
        };

        set(stateRef, roundedState).catch(err => {
            console.error('SyncManager: Failed to write state', err);
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
            // console.log(`[SyncManager] Updated remote player ${uid} at pos ${state.pos.toFixed(2)}`);
        } else {
            // New remote player
            this.remotePlayers.set(uid, {
                uid,
                previousState: state,
                currentState: state,
                lastUpdateTime: Date.now(),
            });
            // console.log(`[SyncManager] New remote player detected: ${uid}`);
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
