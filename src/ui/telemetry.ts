import { GameStateManager, PHYSICS_VARIABLES } from '../game/state';

export class TelemetryManager {
    private container: HTMLElement | null = null;
    private unsubscribe: (() => void) | null = null;
    private gameStateManager: GameStateManager;
    private history: Record<string, number[]> = {};
    private readonly MAX_HISTORY = 50;

    constructor(gameStateManager: GameStateManager) {
        this.gameStateManager = gameStateManager;
        PHYSICS_VARIABLES.forEach(v => this.history[v] = []);
        this.initializeDOM();
        this.unsubscribe = this.gameStateManager.subscribe((_state) => this.updateView());
    }

    private initializeDOM(): void {
        const app = document.getElementById('game-app') || document.body;

        this.container = document.createElement('div');
        this.container.id = 'telemetry-sidebar';
        this.container.className = 'telemetry-sidebar';

        let html = `
            <div class="telemetry-header">TELEMETRY</div>
            <div class="telemetry-row energy-row" data-var="energy">
                <div class="telemetry-label">RESONANCE ENERGY</div>
                <div class="telemetry-value-container">
                    <span class="telemetry-value">0</span>
                </div>
            </div>
        `;

        PHYSICS_VARIABLES.forEach(variable => {
            const label = variable.toUpperCase();
            html += `
                <div class="telemetry-row" data-var="${variable}">
                    <div class="telemetry-label">${label}</div>
                    <div class="telemetry-value-container">
                        <span class="telemetry-value">0.000</span>
                    </div>
                    <div class="telemetry-bar-bg">
                        <div class="telemetry-bar-fill"></div>
                    </div>
                    <canvas class="telemetry-sparkline" width="240" height="20"></canvas>
                </div>
            `;
        });

        this.container.innerHTML = html;
        app.insertBefore(this.container, app.firstChild);
    }

    private updateView(): void {
        if (!this.container) return;

        const state = this.gameStateManager.getState();
        const energyValueEl = this.container.querySelector('.energy-row .telemetry-value');
        if (energyValueEl) {
            energyValueEl.textContent = state.holdingValue.toString();
        }

        const physicsState = this.gameStateManager.getStateFromEngine();
        if (!physicsState) return;

        PHYSICS_VARIABLES.forEach(variable => {
            const row = this.container?.querySelector(`.telemetry-row[data-var="${variable}"]`);
            if (row) {
                const valueEl = row.querySelector('.telemetry-value');
                const fillEl = row.querySelector('.telemetry-bar-fill') as HTMLElement;

                const value = physicsState[variable];
                if (valueEl) {
                    valueEl.textContent = value.toFixed(3);
                }

                if (fillEl) {
                    // Simple normalization for visualization (0-100 range estimate)
                    const maxValues: Record<string, number> = {
                        pos: 1000, // Finish line
                        vel: 50,
                        acc: 20,
                        jerk: 10
                    };
                    const percentage = Math.min(Math.abs(value) / maxValues[variable], 1) * 100;
                    fillEl.style.width = `${percentage}%`;

                    // Update History & Sparkline
                    this.history[variable].push(percentage);
                    if (this.history[variable].length > this.MAX_HISTORY) {
                        this.history[variable].shift();
                    }
                    this.drawSparkline(variable);
                }
            }
        });
    }

    private drawSparkline(variable: string): void {
        const row = this.container?.querySelector(`.telemetry-row[data-var="${variable}"]`);
        const canvas = row?.querySelector('.telemetry-sparkline') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const data = this.history[variable];
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        const colors: Record<string, string> = {
            pos: '#00c3ff', // Matches hsl-pos
            vel: '#00e676', // Matches hsl-vel
            acc: '#ffc400', // Matches hsl-acc
            jerk: '#b247ff' // Matches hsl-jerk
        };
        ctx.strokeStyle = colors[variable] || '#00f3ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        const step = width / (this.MAX_HISTORY - 1);
        data.forEach((val, i) => {
            const x = i * step;
            const y = height - (val / 100) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    /**
     * Trigger a visual flash on the specific variable row
     */
    public triggerFlash(variable: string): void {
        if (!this.container) return;
        const row = this.container.querySelector(`.telemetry-row[data-var="${variable}"]`);
        if (row) {
            row.classList.add('investing');
            setTimeout(() => row.classList.remove('investing'), 500);
        }
    }

    public destroy(): void {
        if (this.unsubscribe) this.unsubscribe();
        this.container?.remove();
    }
}
