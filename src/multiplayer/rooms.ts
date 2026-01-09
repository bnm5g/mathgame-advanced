import { ref, set, runTransaction, serverTimestamp } from 'firebase/database';
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
            await runTransaction(roomRef, (currentData: RoomData | null) => {
                // 1. Check if room exists
                if (currentData === null) {
                    return; // Abort, room doesn't exist
                }

                // 2. Validate Password
                if (currentData.password !== password) {
                    throw new Error('Invalid Credentials'); // Will abort transaction
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
        } catch (error: any) {
            console.error('Join failed:', error);
            throw error;
        }
    }
}

export const roomManager = new RoomManager();
