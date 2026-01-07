import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameEngine } from './engine';
import { gameStateManager } from './state';

describe('GameEngine Story 1.7 Verification', () => {
    let engine: GameEngine;

    beforeEach(() => {
        engine = new GameEngine();
        gameStateManager.setEngine(engine.physics);
    });

    afterEach(() => {
        engine.stop();
    });

    it('should detect finish line and stop engine', () => {
        // Set position close to finish line (1000)
        engine.physics.setState({ pos: 999, vel: 20 });

        engine.start();
        expect(engine.isRunning).toBe(true);

        // Force a loop tick using new public tick() method
        engine.tick(0.1);

        expect(gameStateManager.getState().isRaceFinished).toBe(true);
        expect(gameStateManager.getState().raceEndTime).not.toBeNull();
        expect(engine.isRunning).toBe(false);
    });
});
