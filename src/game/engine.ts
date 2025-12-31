import { PhysicsEngine } from './physics';

export class GameEngine {
    private lastTime: number = 0;
    private animationFrameId: number | null = null;
    public isRunning: boolean = false;
    private observers: Set<(dt: number) => void> = new Set();

    // Physics constants
    private readonly FIXED_DT = 1 / 30; // 30 FPS physics ticks
    private accumulator = 0;
    public physics: PhysicsEngine;

    constructor() {
        this.physics = new PhysicsEngine();
    }

    public start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTime = performance.now();
        this.accumulator = 0;
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    public stop(): void {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    public subscribe(callback: (dt: number) => void): () => void {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }

    private loop = (timestamp: number): void => {
        if (!this.isRunning) return;

        // Calculate delta time in seconds
        let frameTime = (timestamp - this.lastTime) / 1000;
        if (frameTime > 0.1) frameTime = 0.1; // Cap to avoid spiral of death

        this.lastTime = timestamp;
        this.accumulator += frameTime;

        // Fixed Timestep Physics Updates
        while (this.accumulator >= this.FIXED_DT) {
            this.physics.update(this.FIXED_DT);
            this.accumulator -= this.FIXED_DT;
            this.notify(this.FIXED_DT);
        }

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    private notify(dt: number): void {
        this.observers.forEach(observer => observer(dt));
    }
}

export const engine = new GameEngine();
