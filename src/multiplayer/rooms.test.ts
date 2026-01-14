import { describe, it, expect, vi } from 'vitest';
import { RoomManager } from './rooms';
// import { auth } from './auth';

// Mock Firebase
vi.mock('firebase/database', () => ({
    getDatabase: vi.fn(),
    ref: vi.fn(() => ({ key: 'mock-ref' })),
    set: vi.fn(),
    update: vi.fn(),
    onValue: vi.fn(),
    runTransaction: vi.fn(),
    serverTimestamp: vi.fn(() => ({}))
}));

vi.mock('./firebase', () => ({
    database: {}
}));

vi.mock('./auth', () => ({
    auth: {
        currentUser: { uid: 'test-uid' }
    }
}));

describe('RoomManager', () => {
    // Access private method via any cast or by exporting it for testing (using any for now as it's private)
    it('should generate a 6-character room ID', () => {
        const manager = new RoomManager();
        const roomId = (manager as any).generateRoomId();

        expect(roomId).toHaveLength(6);
        expect(roomId).toMatch(/^[A-Z2-9]+$/); // Alphanumeric, no ambiguous chars
    });

    it('should not contain confusing characters (I, O, 1, 0, Z/2 confusion ok but we excluded 0/O/1/I)', () => {
        const manager = new RoomManager();
        // Run multiple times to be sure
        for (let i = 0; i < 100; i++) {
            const roomId = (manager as any).generateRoomId();
            expect(roomId).not.toMatch(/[IO01]/);
        }
    });

    describe('joinRoom', () => {
        it('should join successfully if data is valid', async () => {
            const manager = new RoomManager();
            const { runTransaction } = await import('firebase/database');

            vi.mocked(runTransaction).mockResolvedValue({ committed: true, snapshot: {} } as any);

            // This will fail because joinRoom is not implemented yet
            await expect(manager.joinRoom('ROOMID', 'password')).resolves.not.toThrow();
            expect(runTransaction).toHaveBeenCalled();
        });

        it('should fail if password does not match', async () => {
            const manager = new RoomManager();
            const { runTransaction } = await import('firebase/database');

            // Mock transaction to return current data with a password
            vi.mocked(runTransaction).mockImplementation(async (_ref, updateFunction: any) => {
                const currentData = { password: 'correct-password', players: {} };
                const result = updateFunction(currentData);
                return { committed: true, snapshot: { val: () => result } } as any;
            });

            await expect(manager.joinRoom('ROOMID', 'wrong-password'))
                .rejects.toThrow('Invalid Credentials');
        });

        it('should fail if room is full (4 players)', async () => {
            const manager = new RoomManager();
            const { runTransaction } = await import('firebase/database');

            vi.mocked(runTransaction).mockImplementation(async (_ref, updateFunction: any) => {
                const currentData = {
                    password: 'password',
                    players: { 'p1': {}, 'p2': {}, 'p3': {}, 'p4': {} }
                };
                const result = updateFunction(currentData);
                return { committed: true, snapshot: { val: () => result } } as any;
            });

            await expect(manager.joinRoom('ROOMID', 'password'))
                .rejects.toThrow('Room Full');
        });
    });

    describe('Race Coordination', () => {
        it('should update room status to COUNTDOWN when host starts race', async () => {
            const { update } = await import('firebase/database');
            const manager = new RoomManager();
            const roomId = 'TEST123';

            // Mock user as host
            manager.createRoom('password');

            await manager.startRace(roomId);

            expect(update).toHaveBeenCalledWith(
                expect.any(Object), // Ref check
                { status: 'COUNTDOWN' }
            );
        });

        it('should throw error if startRace fails', async () => {
            const { update } = await import('firebase/database');
            const manager = new RoomManager();
            vi.mocked(update).mockRejectedValueOnce(new Error('Firebase error'));

            await expect(manager.startRace('TEST123')).rejects.toThrow('Failed to start race');
        });
    });
});
