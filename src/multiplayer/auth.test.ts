import { describe, it, expect, vi } from 'vitest';
import { authenticateAnonymously } from './auth';
import { signInAnonymously } from 'firebase/auth';

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({})),
    signInAnonymously: vi.fn(),
    onAuthStateChanged: vi.fn()
}));

describe('Authentication', () => {
    it('should sign in anonymously and return user', async () => {
        const mockUser = { uid: 'test-uid-123', isAnonymous: true };
        vi.mocked(signInAnonymously).mockResolvedValue({ user: mockUser } as any);

        const user = await authenticateAnonymously();
        expect(signInAnonymously).toHaveBeenCalled();
        expect(user.uid).toBe('test-uid-123');
    });
});
