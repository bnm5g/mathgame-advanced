import { describe, it, expect, beforeEach } from 'vitest';
import { PhysicsEngine } from './physics';

describe('PhysicsEngine', () => {
    let physics: PhysicsEngine;

    beforeEach(() => {
        physics = new PhysicsEngine();
    });

    it('should initialize with 0 values', () => {
        const state = physics.getState();
        expect(state.pos).toBe(0);
        expect(state.vel).toBe(0);
        expect(state.acc).toBe(0);
        expect(state.jerk).toBe(0);
    });

    it('should update acceleration based on jerk', () => {
        physics.setState({ jerk: 10 });
        physics.update(0.1); // 10 * 0.1 = 1 accel
        expect(physics.getState().acc).toBe(1);
    });

    it('should perform derivative cascade correctly', () => {
        physics.setState({ jerk: 1 });
        // dt = 1s for simple math
        // tick 1: j=1 -> acc=1, vel=1, pos=1
        physics.update(1);
        let state = physics.getState();
        expect(state.acc).toBe(1);
        expect(state.vel).toBe(1);
        expect(state.pos).toBe(1);

        // tick 2: j=1 -> acc=2, vel=1+2=3, pos=1+3=4
        physics.update(1);
        state = physics.getState();
        expect(state.acc).toBe(2);
        expect(state.vel).toBe(3);
        expect(state.pos).toBe(4);
    });

    it('should round values to 3 decimal places', () => {
        physics.setState({ jerk: 0.12345 });
        physics.update(1);
        expect(physics.getState().acc).toBe(0.123);
    });
});
