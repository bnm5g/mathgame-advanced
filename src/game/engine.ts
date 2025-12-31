export class GameEngine {
    private lastTime: number = 0;
    private animationFrameId: number | null = null;
    public isRunning: boolean = false;
    private observers: Set<(dt: number) => void> = new Set();

    public start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTime = performance.now();
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
        // Prevent huge dt if tab was inactive or first fram
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        this.notify(dt);

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    private notify(dt: number): void {
        this.observers.forEach(observer => observer(dt));
    }
}

export const engine = new GameEngine();
