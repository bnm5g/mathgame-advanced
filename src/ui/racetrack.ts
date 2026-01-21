import type { RemotePlayer } from '../multiplayer/sync';
import type { IPhysicsState } from '../game/physics';

export class RaceTrackRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private container: HTMLElement;

    private readonly TRACK_LENGTH = 1000; // Match FINISH_LINE_DISTANCE
    private readonly CAR_WIDTH = 80;
    private readonly CAR_HEIGHT = 30;
    private readonly LANE_HEIGHT = 50;

    constructor(containerId: string = 'game-container') {
        this.container = document.getElementById(containerId)!;

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'race-track';
        this.canvas.width = 900;
        this.canvas.height = 300;
        this.canvas.style.cssText = 'border: 3px solid #00ff88; background: #000; margin: 20px auto; display: block; box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);';

        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d')!;
        console.log('[RaceTrack] Canvas created:', this.canvas.width, 'x', this.canvas.height);
    }

    /**
     * Render the race track with local and remote players
     */
    public render(localState: IPhysicsState, remotePlayers: RemotePlayer[], isLocalConnected: boolean = true, isLocalResonant: boolean = false): void {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw finish line
        this.drawFinishLine();

        // Draw local player (you)
        this.drawCar(
            localState.pos,
            0,
            isLocalConnected ? (isLocalResonant ? '#00ffff' : '#00ff88') : '#4a4a4a',
            isLocalConnected ? 'YOU' : 'YOU (Offline)',
            isLocalResonant
        );

        // Draw remote players (ghosts)
        remotePlayers.forEach((player, index) => {
            const interpolatedState = player.currentState;

            // Handle disconnected players
            if (interpolatedState.connected === false) {
                // Render as 'ghost'/gray
                this.drawCar(interpolatedState.pos, index + 1, '#4a4a4a', `P${index + 2} (Offline)`);
            } else {
                const isResonant = !!interpolatedState.isResonanceActive;
                this.drawCar(
                    interpolatedState.pos,
                    index + 1,
                    isResonant ? '#00ffff' : '#ff6b6b',
                    `P${index + 2}`,
                    isResonant
                );
            }
        });

        // Draw progress bar
        this.drawProgressBar(localState.pos);
    }

    private drawCar(position: number, laneIndex: number, color: string, label: string, isResonant: boolean = false): void {
        // Calculate x position (0 to canvas.width based on position/TRACK_LENGTH)
        const progress = Math.min(position / this.TRACK_LENGTH, 1);
        const x = progress * (this.canvas.width - this.CAR_WIDTH - 20) + 10;
        const y = 30 + laneIndex * this.LANE_HEIGHT;

        // Draw car rectangle with shadow
        this.ctx.shadowBlur = isResonant ? 20 : 10;
        this.ctx.shadowColor = color;
        this.ctx.fillStyle = color;

        if (isResonant) {
            // Pulsing effect for resonant cars
            const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
            this.ctx.shadowBlur = 10 + pulse * 20;
        }

        this.ctx.fillRect(x, y, this.CAR_WIDTH, this.CAR_HEIGHT);
        this.ctx.shadowBlur = 0; // Reset shadow

        // Draw border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, this.CAR_WIDTH, this.CAR_HEIGHT);

        // Draw label
        const isOffline = label.includes('(Offline)');
        const mainLabel = label.replace(' (Offline)', '');

        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 12px monospace';
        this.ctx.textAlign = 'center';

        if (isOffline) {
            // Split label to fit better
            this.ctx.fillText(mainLabel, x + this.CAR_WIDTH / 2, y + 14);
            this.ctx.font = 'italic 10px monospace';
            this.ctx.fillText('OFFLINE', x + this.CAR_WIDTH / 2, y + 24);
        } else {
            this.ctx.fillText(mainLabel, x + this.CAR_WIDTH / 2, y + this.CAR_HEIGHT / 2 + 5);
        }

        this.ctx.textAlign = 'left'; // Reset
    }

    private drawFinishLine(): void {
        const x = this.canvas.width - 15;
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    private drawProgressBar(position: number): void {
        const progress = Math.min(position / this.TRACK_LENGTH, 1);
        const barWidth = this.canvas.width - 40;
        const barHeight = 10;
        const x = 20;
        const y = this.canvas.height - 30;

        // Background
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(x, y, barWidth, barHeight);

        // Progress
        this.ctx.fillStyle = '#00ff88';
        this.ctx.fillRect(x, y, barWidth * progress, barHeight);

        // Text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`${Math.round(progress * 100)}%`, x + barWidth + 10, y + 9);
    }

    public destroy(): void {
        this.canvas.remove();
    }
}
