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

        // Ensure performance.now() is tied to fake timers
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
        expect(engine.physics).toBeDefined();
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

    it('should notify subscribers on update after enough time passes', () => {
        let capturedDt = -1;
        const callback = vi.fn((dt: number) => { capturedDt = dt; });

        engine.subscribe(callback);

        engine.start();
        vi.advanceTimersByTime(100); // Trigger several 16ms frames
        engine.stop();

        expect(callback).toHaveBeenCalled();
        expect(capturedDt).toBeCloseTo(1 / 30, 4);
    });

    it('should support multiple subscribers', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        engine.subscribe(cb1);
        engine.subscribe(cb2);

        engine.start();
        vi.advanceTimersByTime(100);
        engine.stop();

        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });

    it('should stop notifying after unsubscribe', () => {
        const callback = vi.fn();
        const unsubscribe = engine.subscribe(callback);

        engine.start();
        vi.advanceTimersByTime(100);
        expect(callback).toHaveBeenCalled();
        callback.mockClear();

        unsubscribe();
        vi.advanceTimersByTime(100);
        expect(callback).not.toHaveBeenCalled();

        engine.stop();
    });

    it('should run multiple physics ticks if frame time is large', () => {
        const callback = vi.fn();
        engine.subscribe(callback);

        engine.start();

        // Wait for first frame to establish lastTime
        vi.advanceTimersByTime(16);
        callback.mockClear();

        // Now advance time significantly BEFORE the next raf callback fires
        // The mock RAF schedules a timeout for 16ms. 
        // If we advance by 100ms, the next callback will execute with a timestamp jumped by 100ms.
        vi.advanceTimersByTime(100);

        // 100ms jump / 33.3ms FIXED_DT = 3 ticks
        expect(callback).toHaveBeenCalledTimes(3);

        engine.stop();
    });
});
