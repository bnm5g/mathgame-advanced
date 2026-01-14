export class CountdownOverlay {
    private container: HTMLElement;
    private onComplete: () => void;
    private count: number = 3;

    constructor(onComplete: () => void) {
        this.onComplete = onComplete;
        this.container = document.createElement('div');
        this.container.className = 'countdown-overlay';
    }

    public start(): void {
        const app = document.getElementById('game-app');
        if (!app) {
            console.error('Game app container not found');
            return;
        }

        app.appendChild(this.container);
        this.render();
        this.tick();
    }

    private render(): void {
        this.container.innerHTML = `
            <div class="countdown-text">${this.count > 0 ? this.count : 'GO!'}</div>
        `;
        // Apply basic styles for visibility if not in CSS yet
        this.container.style.cssText = `
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            display: flex; justify-content: center; align-items: center;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
        `;
        const text = this.container.querySelector('.countdown-text') as HTMLElement;
        if (text) {
            text.style.cssText = `
                font-size: 8rem;
                font-family: monospace;
                color: #00ff88;
                font-weight: bold;
                text-shadow: 0 0 20px #00ff88;
            `;
        }
    }

    private tick(): void {
        if (this.count > 0) {
            setTimeout(() => {
                this.count--;
                this.render();
                if (this.count === 0) {
                    this.onComplete();
                    setTimeout(() => this.cleanup(), 500); // Show GO for 0.5s then cleanup
                } else {
                    this.tick();
                }
            }, 1000);
        }
    }

    private cleanup(): void {
        if (this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }
}
