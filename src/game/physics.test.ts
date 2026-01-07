import { describe, it, expect, beforeEach } from 'vitest';
import { PhysicsEngine } from './physics';

describe('PhysicsEngine Strategic Allocation', () => {
    let engine: PhysicsEngine;

    beforeEach(() => {
        engine = new PhysicsEngine();
    });

    it('should add value to jerk and round to 3 decimals', () => {
        engine.addValue('jerk', 0.1234);
        const state = engine.getState();
        expect(state.jerk).toBe(0.123);
    });

    it('should add value to acceleration and round to 3 decimals', () => {
        engine.addValue('acc', 1.5555);
        const state = engine.getState();
        expect(state.acc).toBe(1.556);
    });

    it('should add value to velocity and round to 3 decimals', () => {
        engine.addValue('vel', 10.1);
        const state = engine.getState();
        expect(state.vel).toBe(10.1);
    });

    it('should add value to position and round to 3 decimals', () => {
        engine.addValue('pos', 500.0009);
        const state = engine.getState();
        expect(state.pos).toBe(500.001);
    });
});

describe('PhysicsEngine Friction Spike Penalty', () => {
    let engine: PhysicsEngine;

    beforeEach(() => {
        engine = new PhysicsEngine();
    });

    it('should apply 0.95 friction multiplier when isFrictionActive is true', () => {
        engine.setState({ acc: 10, vel: 10, jerk: 0 });

        // Before update: acc=10, vel=10
        // Expected with friction:
        // acc = 10 * 0.95 = 9.5
        // vel = 10 * 0.95 = 9.5
        // pos = 0 + (9.5 * 0.1) = 0.95 (if dt=0.1)

        // @ts-ignore - testing new feature before implementation
        engine.update(0.1, true);

        const state = engine.getState();
        expect(state.acc).toBe(9.5);
        expect(state.vel).toBe(10.45);
    });

    it('should NOT apply friction when isFrictionActive is false', () => {
        engine.setState({ acc: 10, vel: 10, jerk: 0 });

        engine.update(0.1); // default or false

        const state = engine.getState();
        expect(state.acc).toBe(10.0);
        expect(state.vel).toBe(11.0); // vel = 10 + (10 * 0.1)
    });
});
