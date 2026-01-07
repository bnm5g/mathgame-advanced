import { GameStateManager, PHYSICS_VARIABLES } from '../game/state';

export class TelemetryManager {
    private container: HTMLElement | null = null;
    private unsubscribe: (() => void) | null = null;
    private gameStateManager: GameStateManager;

    constructor(gameStateManager: GameStateManager) {
        this.gameStateManager = gameStateManager;
        this.initializeDOM();
        this.unsubscribe = this.gameStateManager.subscribe((_state) => this.updateView());
    }

    private initializeDOM(): void {
        const app = document.getElementById('game-app') || document.body;

        this.container = document.createElement('div');
        this.container.id = 'telemetry-sidebar';
        this.container.className = 'telemetry-sidebar';

        let html = '<div class="telemetry-header">TELEMETRY</div>';

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
                </div>
            `;
        });

        this.container.innerHTML = html;
        app.insertBefore(this.container, app.firstChild);
    }

    private updateView(): void {
        if (!this.container) return;
        // Logic to update bars/values from gameStateManager.engine state will go here in next epic
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
