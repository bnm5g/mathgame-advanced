import { GameStateManager, PHYSICS_VARIABLES } from '../game/state';
import type { GameState } from '../game/state';

export class TelemetryManager {
    private container: HTMLElement | null = null;
    private unsubscribe: (() => void) | null = null;
    private gameStateManager: GameStateManager;
    private history: Record<string, number[]> = {};
    private readonly MAX_HISTORY = 50; // 5 seconds at 10Hz
    private sampleInterval: any = null;
    private lastAllocatedIndex: number | null = null;
    private barPercentages: Record<string, number> = { pos: 0, vel: 0, acc: 0, jerk: 0 };

    constructor(gameStateManager: GameStateManager) {
        this.gameStateManager = gameStateManager;
        PHYSICS_VARIABLES.forEach(v => this.history[v] = Array(this.MAX_HISTORY).fill(0));
        this.initializeDOM();

        // Sample physics data at 10Hz for smooth sparklines
        this.sampleInterval = setInterval(() => this.samplePhysics(), 100);

        // Still subscribe for UI state changes (holding value and flash)
        this.unsubscribe = this.gameStateManager.subscribe((state) => {
            this.updateStaticElements(state);
            this.checkForAllocationFlash(state);
        });
    }

    private initializeDOM(): void {
        const app = document.getElementById('game-app') || document.body;

        this.container = document.createElement('div');
        this.container.id = 'telemetry-sidebar';
        this.container.className = 'telemetry-sidebar';

        let html = `
            <div class="telemetry-header">TELEMETRY</div>
            <div class="telemetry-sidebar-content">
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
                <div class="telemetry-row" data-var="${variable}" role="button" aria-label="Allocate to ${label}">
                    <div class="telemetry-label">${label}</div>
                    <div class="telemetry-value-container">
                        <span class="telemetry-value" aria-label="current ${label} value">0.000</span>
                    </div>
                    <div class="telemetry-bar-bg" aria-hidden="true">
                        <div class="telemetry-bar-fill"></div>
                    </div>
                    <canvas class="telemetry-sparkline" width="240" height="40" aria-label="${label} history graph"></canvas>
                </div>
            `;
        });

        html += `</div>`;

        this.container.innerHTML = html;
        app.insertBefore(this.container, app.firstChild);

        // Add touch/click listeners for allocation
        this.addInteractionListeners();
    }

    private addInteractionListeners(): void {
        const rows = this.container?.querySelectorAll('.telemetry-row');
        rows?.forEach((row, index) => {
            // physics variables start at index 1 in the HTML loop (energy is index 0)
            if (index === 0) return; // Skip energy row

            const handleAllocation = () => {
                const state = this.gameStateManager.getState();
                if (state.isAllocationActive) {
                    const choiceIndex = index - 1;
                    console.log('[Telemetry] Allocation via sidebar:', choiceIndex);
                    this.gameStateManager.allocatePoints(choiceIndex);
                    this.triggerFlash(PHYSICS_VARIABLES[choiceIndex]);
                }
            };

            row.addEventListener('click', (e) => {
                e.preventDefault();
                handleAllocation();
            });
        });
    }

    /**
     * Samples physics data at a fixed frequency (10Hz)
     */
    private samplePhysics(): void {
        const physicsState = this.gameStateManager.getStateFromEngine();
        if (!physicsState) return;

        PHYSICS_VARIABLES.forEach(variable => {
            const value = physicsState[variable];

            this.history[variable].push(value);
            if (this.history[variable].length > this.MAX_HISTORY) {
                this.history[variable].shift();
            }

            // Update individual value and bar immediately
            const row = this.container?.querySelector(`.telemetry-row[data-var="${variable}"]`);
            if (row) {
                const valueEl = row.querySelector('.telemetry-value');
                const fillEl = row.querySelector('.telemetry-bar-fill') as HTMLElement;
                if (valueEl) valueEl.textContent = value.toFixed(3);

                if (fillEl) {
                    // Bars still use static max for global "speed/progress" feel
                    const maxValues: Record<string, number> = { pos: 1000, vel: 50, acc: 20, jerk: 10 };
                    const targetPercentage = Math.min(Math.abs(value) / maxValues[variable], 1) * 100;

                    // Smooth lerp (0.2 factor) for bar width
                    this.barPercentages[variable] = this.barPercentages[variable] + (targetPercentage - this.barPercentages[variable]) * 0.2;
                    fillEl.style.width = `${this.barPercentages[variable]}%`;
                }
            }

            this.drawSparkline(variable);
        });
    }

    /**
     * Updates elements that don't need 10Hz sampling
     */
    private updateStaticElements(state: GameState): void {
        if (!this.container) return;

        const energyValueEl = this.container.querySelector('.energy-row .telemetry-value');
        if (energyValueEl) {
            energyValueEl.textContent = state.holdingValue.toString();
        }

        // Apply global resonance class to sidebar if needed
        this.container.classList.toggle('resonance-active', state.isResonanceActive);
    }

    private checkForAllocationFlash(state: GameState): void {
        if (state.lastAllocatedIndex !== null && state.lastAllocatedIndex !== this.lastAllocatedIndex) {
            this.triggerFlash(PHYSICS_VARIABLES[state.lastAllocatedIndex]);
            this.lastAllocatedIndex = state.lastAllocatedIndex;
        }
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

        if (data.length === 0) return;

        // Dynamic Scaling
        let min = Math.min(...data);
        let max = Math.max(...data);
        let range = max - min;

        // Minimum range to avoid flat-line jitter and infinite zoom (e.g. JERK: 0)
        if (range < 0.1) {
            range = 1.0;
            // Center the line if range is small
            min = min - 0.5;
            max = max + 0.5;
        } else {
            // 10% vertical padding
            min -= range * 0.1;
            max += range * 0.1;
            range = max - min;
        }

        // Grid lines (Relative to local scale)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        [0.25, 0.5, 0.75].forEach(p => {
            const y = height * p;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        });

        const isResonance = this.gameStateManager.getState().isResonanceActive;
        const color = isResonance ? '#00ffff' : (this.getVariableColor(variable));

        // Draw Fill Area
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `${color}44`);
        gradient.addColorStop(1, `${color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const step = width / (this.MAX_HISTORY - 1);

        ctx.moveTo(0, height);
        data.forEach((val, i) => {
            const x = i * step;
            const y = height - ((val - min) / range) * height;
            ctx.lineTo(x, y);
        });
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Draw Line
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        data.forEach((val, i) => {
            const x = i * step;
            const y = height - ((val - min) / range) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    private getVariableColor(variable: string): string {
        const colors: Record<string, string> = {
            pos: '#00c3ff',
            vel: '#00e676',
            acc: '#ffc400',
            jerk: '#b247ff'
        };
        return colors[variable] || '#ffffff';
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
        if (this.sampleInterval) clearInterval(this.sampleInterval);
        this.container?.remove();
    }
}
