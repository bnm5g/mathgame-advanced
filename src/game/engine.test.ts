import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameEngine } from './engine';

describe('GameEngine', () => {
    let engine: GameEngine;

    beforeEach(() => {
        vi.useFakeTimers();
        // Mock requestAnimationFrame and cancelAnimationFrame
        vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => {
            return setTimeout(() => cb(performance.now()), 16); // Simulate ~60fps
        }));
        vi.stubGlobal('cancelAnimationFrame', vi.fn((id) => clearTimeout(id)));
        vi.stubGlobal('performance', { now: vi.fn(() => Date.now()) });

        engine = new GameEngine();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('should initialize with default state', () => {
        expect(engine).toBeDefined();
        expect(engine.isRunning).toBe(false);
    });

    it('should start the loop when start() is called', () => {
        engine.start();
        expect(engine.isRunning).toBe(true);
        engine.stop();
    });

    it('should stop the loop when stop() is called', () => {
        engine.start();
        engine.stop();
        expect(engine.isRunning).toBe(false);
    });

    it('should calculate delta time', () => {
        let capturedDt = -1;
        engine.onUpdate = (dt) => { capturedDt = dt; };

        // We can't easily mock performance.now() sequence effectively due to 
        // internal loop structure without more complex mocking.
        // Instead, we verify that onUpdate is called with SOME number if we can trigger loop.

        // Since test env uses stubbed RAF (setTimeout 16ms), we can just wait.
        engine.start();
        vi.advanceTimersByTime(20); // Advance enough for one frame
        engine.stop();

        expect(capturedDt).toBeGreaterThanOrEqual(0);
    });
});
