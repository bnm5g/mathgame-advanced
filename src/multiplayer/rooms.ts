import { ref, set, runTransaction, serverTimestamp, onValue, update, get } from 'firebase/database';
import { database } from './firebase';
import { auth } from './auth';

export interface PlayerEntry {
    name: string;
    slot: number; // 0-3
    status: 'online' | 'offline';
    ready: boolean;
}

export interface RoomData {
    hostId: string;
    password: string; // Plaintext for MVP
    status: 'LOBBY' | 'COUNTDOWN' | 'RACING' | 'FINISHED';
    createdAt: object; // ServerTimestamp
    players: Record<string, PlayerEntry>;
}

export class RoomManager {
    /**
     * Creates a new private room
     * @param password Room password
     * @returns The generated Room ID
     */
    async createRoom(password: string): Promise<string> {
        if (!auth.currentUser) {
            throw new Error('User must be authenticated to create a room.');
        }

        const roomId = this.generateRoomId();
        const roomRef = ref(database, `rooms/${roomId}`);

        const initialData: RoomData = {
            hostId: auth.currentUser.uid,
            password: password,
            status: 'LOBBY',
            createdAt: serverTimestamp(),
            players: {
                [auth.currentUser.uid]: {
                    name: 'Host',
                    slot: 0,
                    status: 'online',
                    ready: true
                }
            }
        };

        try {
            await set(roomRef, initialData);
            return roomId;
        } catch (error) {
            console.error('Failed to create room:', error);
            throw error;
        }
    }

    /**
     * Generates a 6-character alphanumeric room code (e.g., "X7K9P2")
     */
    private generateRoomId(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 to avoid confusion
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Joins an existing room
     * @param roomId The room code
     * @param password The room password
     */
    async joinRoom(roomId: string, password: string): Promise<void> {
        if (!auth.currentUser) throw new Error('User must be authenticated to join.');

        const roomRef = ref(database, `rooms/${roomId}`);

        try {
            // 0. Pre-fetch check (Primes cache and verifies message)
            const snapshot = await get(roomRef);
            if (!snapshot.exists()) {
                throw new Error('Room not found');
            }

            const result = await runTransaction(roomRef, (currentData: RoomData | null) => {
                // 1. Check if room exists (Optimistic check)
                if (currentData === null) {
                    // CRITICAL: Return 'null' instead of 'undefined'.
                    // 'undefined' aborts the transaction immediately.
                    // 'null' attempts to write null, which causes a server mismatch/retry if data actually exists.
                    return null;
                }

                // 2. Validate Password
                // Strict check: if room has password, input must match.
                // If input has password but room doesn't, that's fine (or restrict it?).
                // Let's enforce strict match if room password is set.
                if (currentData.password && currentData.password !== password) {
                    // We must throw to abort the transaction and propagate error
                    throw new Error('Invalid Credentials');
                }

                // 3. Check Capacity
                const currentPlayers = currentData.players || {};
                const isAlreadyJoined = !!currentPlayers[auth.currentUser!.uid];

                if (!isAlreadyJoined && Object.keys(currentPlayers).length >= 4) {
                    throw new Error('Room Full');
                }

                // 4. Add/Update Player
                if (!currentData.players) currentData.players = {};

                if (isAlreadyJoined) {
                    currentData.players[auth.currentUser!.uid].status = 'online';
                } else {
                    const nextSlot = Object.keys(currentPlayers).length;
                    currentData.players[auth.currentUser!.uid] = {
                        name: 'Guest',
                        slot: nextSlot,
                        status: 'online',
                        ready: false
                    };
                }

                return currentData;
            });

            if (!result.committed) {
                // If not committed and no error thrown, it means we returned undefined (room didn't exist)
                // Or max retries exceeded
                throw new Error('Room does not exist or join failed');
            }

            if (!result.snapshot.exists()) {
                throw new Error('Room no longer exists');
            }

        } catch (error) {
            console.error('Join failed:', error);
            throw error;
        }
    }

    /**
     * Start the race (Host only)
     * Updates status to COUNTDOWN
     */
    async startRace(roomId: string): Promise<void> {
        if (!auth.currentUser) throw new Error('User must be authenticated.');

        const roomRef = ref(database, `rooms/${roomId}`);
        try {
            // In a real app we'd verify host privilege again here via rules or txn
            // For MVP, simple update is fine
            await update(roomRef, {
                status: 'COUNTDOWN'
            });
        } catch (error) {
            console.error('Failed to start race:', error);
            throw new Error('Failed to start race');
        }
    }

    /**
     * Listen for room status changes
     */
    listenToStatus(roomId: string, callback: (status: RoomData['status']) => void): () => void {
        const statusRef = ref(database, `rooms/${roomId}/status`);

        return onValue(statusRef, (snapshot) => {
            const status = snapshot.val();
            if (status) {
                callback(status);
            }
        });
    }
}


export const roomManager = new RoomManager();
