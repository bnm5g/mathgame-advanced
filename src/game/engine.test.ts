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

    it('should notify subscribers on update', () => {
        let capturedDt = -1;
        const callback = vi.fn((dt: number) => { capturedDt = dt; });

        engine.subscribe(callback);

        engine.start();
        vi.advanceTimersByTime(20);
        engine.stop();

        expect(callback).toHaveBeenCalled();
        expect(capturedDt).toBeGreaterThan(0);
    });

    it('should support multiple subscribers', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        engine.subscribe(cb1);
        engine.subscribe(cb2);

        engine.start();
        vi.advanceTimersByTime(20);
        engine.stop();

        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });

    it('should stop notifying after unsubscribe', () => {
        const callback = vi.fn();
        const unsubscribe = engine.subscribe(callback);

        engine.start();
        vi.advanceTimersByTime(20);
        expect(callback).toHaveBeenCalled(); // Called once
        callback.mockClear();

        unsubscribe();
        vi.advanceTimersByTime(20);
        expect(callback).not.toHaveBeenCalled(); // Not called again

        engine.stop();
    });
});
