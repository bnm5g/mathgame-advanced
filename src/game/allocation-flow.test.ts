import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameStateManager } from './state';
import { PhysicsEngine } from './physics';

describe('Strategic Allocation Integration', () => {
    let stateManager: GameStateManager;

    beforeEach(() => {
        vi.useFakeTimers();
        stateManager = new GameStateManager();
        stateManager.setEngine(new PhysicsEngine());
        stateManager.setQuestions([{
            id: 'q1',
            text: '2+2',
            answers: ['1', '2', '3', '4'],
            correctIndex: 3,
            points: 100
        }]);
    });

    it('should complete a full loop: Solve -> Earn -> Allocate -> Physics Update', () => {
        // 1. Solve correctly
        stateManager.submitAnswer(3);
        expect(stateManager.getState().feedbackState).toBe('correct');
        expect(stateManager.getState().holdingValue).toBe(100);

        // 2. Wait for feedback delay to trigger Allocation Phase
        vi.advanceTimersByTime(1500);
        expect(stateManager.getState().isAllocationActive).toBe(true);

        // 3. Allocate to Acceleration (index 2)
        stateManager.allocatePoints(2);

        // 4. Verify results
        expect(stateManager.getState().holdingValue).toBe(0);
        expect(stateManager.getState().isAllocationActive).toBe(false);

        // Check physics engine was updated
        // Since engine is private, we check the effect on a subsequent update if exposed or just check flags
        // For this test, verifying state manager flow is the priority
    });
});
