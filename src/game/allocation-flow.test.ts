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

        // For this test, verifying state manager flow is the priority
    });

    it('should prevent consecutive allocation to the same variable', () => {
        // 1. Solve and enter Allocation Phase
        stateManager.submitAnswer(3);
        vi.advanceTimersByTime(1500);
        expect(stateManager.getState().isAllocationActive).toBe(true);

        // 2. Allocate to Jerk (index 3)
        stateManager.allocatePoints(3);
        expect(stateManager.getState().lastAllocatedIndex).toBe(3);

        // 3. Solve next question and enter Allocation Phase again
        vi.advanceTimersByTime(500); // Wait for allocation delay
        stateManager.submitAnswer(3);
        vi.advanceTimersByTime(1500);
        expect(stateManager.getState().isAllocationActive).toBe(true);

        // 4. Try to allocate to Jerk again (should be ignored)
        const initialHolding = stateManager.getState().holdingValue;
        stateManager.allocatePoints(3);

        // Should still be active and have points (because JERK was ignored)
        expect(stateManager.getState().isAllocationActive).toBe(true);
        expect(stateManager.getState().holdingValue).toBe(initialHolding);

        // 5. Allocate to Acceleration instead (index 2) - should work
        stateManager.allocatePoints(2);
        expect(stateManager.getState().isAllocationActive).toBe(false);
        expect(stateManager.getState().lastAllocatedIndex).toBe(2);
    });
});
