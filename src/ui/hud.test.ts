import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HUDManager } from './hud';
import { GameStateManager } from '../game/state';
import { PhysicsEngine } from '../game/physics';

describe('HUDManager Story 1.6 Verification', () => {
    let gameStateManager: GameStateManager;
    const mockQuestion = {
        id: 'q1',
        text: 'Test?',
        answers: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
        points: 10
    };

    beforeEach(() => {
        // Setup JSDOM body
        document.body.innerHTML = '<div id="app"></div>';

        gameStateManager = new GameStateManager();
        gameStateManager.setEngine(new PhysicsEngine());
        gameStateManager.setQuestions([mockQuestion]);
        gameStateManager.setState({ isGameActive: true });
        new HUDManager(gameStateManager);
    });

    it('should toggle friction-spike class based on state', () => {
        const overlay = document.getElementById('hud-overlay')!;

        expect(overlay.classList.contains('friction-spike')).toBe(false);

        // Trigger wrong answer
        gameStateManager.submitAnswer(0); // Wrong if correctIndex is -1 or different

        // Check if class is added
        expect(overlay.classList.contains('friction-spike')).toBe(true);

        // Check text content
        const questionText = overlay.querySelector('.question-text');
        expect(questionText?.textContent).toBe('SYSTEM REBOOT :: DRAG ACTIVE');
    });

    it('should remove friction-spike class when penalty expires', () => {
        const overlay = document.getElementById('hud-overlay')!;

        vi.useFakeTimers();
        gameStateManager.submitAnswer(0);
        expect(overlay.classList.contains('friction-spike')).toBe(true);

        // Advance time by 2.1s
        vi.advanceTimersByTime(2100);

        // Update view manually or via a state change
        // In the real app, state changes (nextQuestion) would trigger a notify.
        // For testing, we call notify manually or trigger a state change.
        gameStateManager.setState({}); // Trigger listeners

        expect(overlay.classList.contains('friction-spike')).toBe(false);
        vi.useRealTimers();
    });
});
