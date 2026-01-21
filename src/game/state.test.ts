import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameStateManager } from './state';
import type { Question } from './state';
import { PhysicsEngine } from './physics';

describe('GameStateManager Validation', () => {
    let stateManager: GameStateManager;
    const mockQuestion: Question = {
        id: 'q1',
        text: 'What is 1+1?',
        answers: ['1', '2', '3', '4'],
        correctIndex: 1,
        points: 10
    };

    beforeEach(() => {
        vi.useFakeTimers();
        stateManager = new GameStateManager();
        stateManager.setEngine(new PhysicsEngine());
        stateManager.setQuestions([mockQuestion]);
        // NextQuestion is automatically called by setQuestions
        (stateManager as any).state.isGameActive = true;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('submitAnswer updates state to correct and awards points', () => {
        stateManager.submitAnswer(1); // Correct index

        const state = stateManager.getState();
        expect(state.feedbackState).toBe('correct');
        expect(state.holdingValue).toBe(10);
    });

    test('submitAnswer updates state to wrong and awards 0 points', () => {
        stateManager.submitAnswer(0); // Wrong index

        const state = stateManager.getState();
        expect(state.feedbackState).toBe('wrong');
        expect(state.holdingValue).toBe(0);
    });

    test('submitAnswer ignores input if feedbackState is not idle', () => {
        stateManager.submitAnswer(1); // First submission
        stateManager.submitAnswer(0); // Second submission during feedback

        const state = stateManager.getState();
        expect(state.feedbackState).toBe('correct'); // Still correct from first input
        expect(state.holdingValue).toBe(10);
    });

    test('state resets and cycles question after delay', async () => {
        // We need a way to mock the loader or just test the transition logic
        // For now, let's test that feedbackState resets after 1500ms
        stateManager.submitAnswer(1);

        vi.advanceTimersByTime(1500);

        const state = stateManager.getState();
        expect(state.feedbackState).toBe('idle');
    });

    test('wrong answer sets frictionSpikeEnd for 2 seconds', () => {
        const startTime = Date.now();
        stateManager.submitAnswer(0); // Wrong index

        const state = stateManager.getState();
        expect(state.frictionSpikeEnd).toBeGreaterThanOrEqual(startTime + 2000);

        expect(stateManager.isFrictionSpikeActive()).toBe(true);

        vi.advanceTimersByTime(2001);
        expect(stateManager.isFrictionSpikeActive()).toBe(false);
    });

    test('isRaceFinished prevents answer submission and allocation', () => {
        stateManager.setState({ isRaceFinished: true });

        stateManager.submitAnswer(1);
        expect(stateManager.getState().feedbackState).toBe('idle');
        expect(stateManager.getState().holdingValue).toBe(0);

        stateManager.setState({ isAllocationActive: true, holdingValue: 10 });
        stateManager.allocatePoints(1);
        expect(stateManager.getState().holdingValue).toBe(10);
        expect(stateManager.getState().isAllocationActive).toBe(true);
    });

    test('submitAnswer increments streak on correct answer', () => {
        stateManager.submitAnswer(1); // Correct
        expect(stateManager.getState().streak).toBe(1);

        // Reset feedback state manually to allow next submission in tests
        (stateManager as any).state.feedbackState = 'idle';
        stateManager.submitAnswer(1); // Correct again
        expect(stateManager.getState().streak).toBe(2);
    });

    test('submitAnswer resets streak on wrong answer', () => {
        stateManager.submitAnswer(1); // Correct
        expect(stateManager.getState().streak).toBe(1);

        (stateManager as any).state.feedbackState = 'idle';
        stateManager.submitAnswer(0); // Wrong
        expect(stateManager.getState().streak).toBe(0);
    });

    test('streak of 5 triggers resonance mode', () => {
        for (let i = 0; i < 5; i++) {
            (stateManager as any).state.feedbackState = 'idle';
            stateManager.submitAnswer(1); // Correct
        }

        const state = stateManager.getState();
        expect(state.streak).toBe(5);
        expect(state.isResonanceActive).toBe(true);
    });

    test('breaking streak after resonance resets isResonanceActive', () => {
        // Trigger resonance
        for (let i = 0; i < 5; i++) {
            (stateManager as any).state.feedbackState = 'idle';
            stateManager.submitAnswer(1);
        }
        expect(stateManager.getState().isResonanceActive).toBe(true);

        // Break streak
        (stateManager as any).state.feedbackState = 'idle';
        stateManager.submitAnswer(0); // Wrong

        const state = stateManager.getState();
        expect(state.streak).toBe(0);
        expect(state.isResonanceActive).toBe(false);
    });
});
