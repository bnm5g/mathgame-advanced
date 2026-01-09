import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SyncManager } from './sync';

// Mock Firebase - must use factory function
vi.mock('firebase/database', () => ({
    ref: vi.fn(),
    set: vi.fn(() => Promise.resolve()),
    onValue: vi.fn(),
    off: vi.fn(),
}));

describe('SyncManager', () => {
    let syncManager: SyncManager;
    let mockDatabase: any;

    beforeEach(async () => {
        const { ref, set, onValue, off } = await import('firebase/database');

        // Reset mocks
        vi.mocked(ref).mockClear();
        vi.mocked(set).mockClear();
        vi.mocked(onValue).mockClear();
        vi.mocked(off).mockClear();

        // Setup default return values
        vi.mocked(ref).mockReturnValue('mock-ref' as any);
        vi.mocked(set).mockResolvedValue(undefined as any);

        mockDatabase = {}; // Mock database object
        syncManager = new SyncManager(mockDatabase);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Throttling Logic', () => {
        it('should throttle writes to max 5 times per second (200ms interval)', async () => {
            const { set } = await import('firebase/database');

            syncManager.startSync('TEST123', 'user1');

            // Simulate rapid state updates (10 updates in 100ms)
            for (let i = 0; i < 10; i++) {
                syncManager.writeLocalState({ pos: i, vel: 0, acc: 0, jerk: 0 });
            }

            // Should only write once immediately
            expect(set).toHaveBeenCalledTimes(1);

            // Wait 200ms and try again
            await new Promise(resolve => setTimeout(resolve, 210));
            syncManager.writeLocalState({ pos: 10, vel: 0, acc: 0, jerk: 0 });

            // Should write second time after throttle period
            expect(set).toHaveBeenCalledTimes(2);
        });
    });

    describe('State Synchronization', () => {
        it('should write local state to Firebase with correct path', async () => {
            const { ref, set } = await import('firebase/database');

            syncManager.startSync('ROOM123', 'user1');
            syncManager.writeLocalState({ pos: 100.123, vel: 5.456, acc: 1.234, jerk: 0.567 });

            expect(ref).toHaveBeenCalledWith(mockDatabase, 'rooms/ROOM123/players/user1/state');
            expect(set).toHaveBeenCalledWith('mock-ref', expect.objectContaining({
                pos: 100.123,
                vel: 5.456,
                acc: 1.234,
                jerk: 0.567,
            }));
        });

        it('should round values to 3 decimal places before writing', async () => {
            const { set } = await import('firebase/database');

            syncManager.startSync('ROOM123', 'user1');
            syncManager.writeLocalState({ pos: 100.123456, vel: 5.456789, acc: 1.234567, jerk: 0.567890 });

            expect(set).toHaveBeenCalledWith('mock-ref', expect.objectContaining({
                pos: 100.123,
                vel: 5.457,
                acc: 1.235,
                jerk: 0.568,
            }));
        });
    });

    describe('Remote Player Management', () => {
        it('should store remote player states when received from Firebase', () => {
            syncManager.startSync('ROOM123', 'user1');

            // Simulate receiving remote player state
            syncManager.updateRemotePlayer('user2', { pos: 50, vel: 3, acc: 0.5, jerk: 0.1, timestamp: Date.now() });

            const remotePlayers = syncManager.getRemotePlayers();
            expect(remotePlayers).toHaveLength(1);
            expect(remotePlayers[0].uid).toBe('user2');
        });

        it('should not include own uid in remote players list', () => {
            syncManager.startSync('ROOM123', 'user1');

            syncManager.updateRemotePlayer('user1', { pos: 100, vel: 5, acc: 1, jerk: 0.5, timestamp: Date.now() });
            syncManager.updateRemotePlayer('user2', { pos: 50, vel: 3, acc: 0.5, jerk: 0.1, timestamp: Date.now() });

            const remotePlayers = syncManager.getRemotePlayers();
            expect(remotePlayers).toHaveLength(1);
            expect(remotePlayers[0].uid).toBe('user2');
        });
    });

    describe('Interpolation', () => {
        it('should interpolate position smoothly between updates', () => {
            syncManager.startSync('ROOM123', 'user1');

            const now = Date.now();
            syncManager.updateRemotePlayer('user2', { pos: 0, vel: 0, acc: 0, jerk: 0, timestamp: now });

            // Simulate update 200ms later
            syncManager.updateRemotePlayer('user2', { pos: 100, vel: 0, acc: 0, jerk: 0, timestamp: now + 200 });

            // Get interpolated state at 100ms (halfway)
            const interpolated = syncManager.getInterpolatedState('user2', now + 100);

            // Should be approximately halfway between 0 and 100
            expect(interpolated.pos).toBeCloseTo(50, 1);
        });
    });

    describe('Lifecycle', () => {
        it('should stop syncing when stopSync is called', async () => {
            const { off } = await import('firebase/database');

            syncManager.startSync('ROOM123', 'user1');
            syncManager.stopSync();

            // Should clean up Firebase listeners
            expect(off).toHaveBeenCalled();
        });
    });
});
