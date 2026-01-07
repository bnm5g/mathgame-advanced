import { GAME_CONSTANTS } from './constants';

export interface IPhysicsState {
    pos: number;
    vel: number;
    acc: number;
    jerk: number;
}

export class PhysicsEngine {
    private state: IPhysicsState;

    constructor() {
        this.state = {
            pos: 0,
            vel: 0,
            acc: 0,
            jerk: 0
        };
    }

    public update(dt: number, isFrictionActive: boolean = false): void {
        if (isFrictionActive) {
            this.state.acc *= GAME_CONSTANTS.FRICTION_COEFFICIENT;
            this.state.vel *= GAME_CONSTANTS.FRICTION_COEFFICIENT;
        }

        // Derivative Cascade
        // da = j * dt
        this.state.acc += this.state.jerk * dt;
        // dv = a * dt
        this.state.vel += this.state.acc * dt;
        // dp = v * dt
        this.state.pos += this.state.vel * dt;

        // Rounding to 3 decimal places for deterministic behavior
        this.state.acc = this.round(this.state.acc);
        this.state.vel = this.round(this.state.vel);
        this.state.pos = this.round(this.state.pos);
    }

    public addValue(variable: keyof IPhysicsState, value: number): void {
        this.state[variable] += value;
        this.state[variable] = this.round(this.state[variable]);
    }

    public getState(): IPhysicsState {
        return { ...this.state };
    }

    public setState(newState: Partial<IPhysicsState>): void {
        this.state = { ...this.state, ...newState };
    }

    private round(value: number): number {
        return Math.round(value * 1000) / 1000;
    }
}
