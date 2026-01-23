import { roomManager } from '../multiplayer/rooms';
import { startMultiplayerSync } from '../main';
import { CountdownOverlay } from './countdown';
import { gameStateManager } from '../game/state';

export class LobbyManager {
    private container: HTMLElement | null = null;

    constructor() {
        this.initializeDOM();
    }

    private initializeDOM(): void {
        this.container = document.getElementById('lobby-overlay');
        if (!this.container) {
            console.error('Lobby overlay not found in DOM');
            return;
        }

        // Initial State: Show Main Menu
        this.showMainMenu();
    }

    private showError(message: string): void {
        const errorEl = this.container?.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = message;
            (errorEl as HTMLElement).style.display = 'block';
        } else {
            alert(message); // Fallback
        }
    }

    private clearError(): void {
        const errorEl = this.container?.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = '';
            (errorEl as HTMLElement).style.display = 'none';
        }
    }

    private showMainMenu(): void {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="lobby-card">
                <h1 class="lobby-title">Calculus Racer</h1>
                
                <div class="lobby-form">
                    <button id="btn-create-view" class="lobby-btn">Create Room</button>
                    
                    <div class="divider"><span>OR</span></div>
                    
                    <div class="input-group">
                        <label>Room Code</label>
                        <input type="text" id="join-code" class="lobby-input" placeholder="XXXXXX" maxlength="6">
                    </div>
                    <div class="input-group">
                         <label>Password</label>
                        <input type="password" id="join-password" class="lobby-input" placeholder="Password (Optional)">
                    </div>
                    <button id="btn-join" class="lobby-btn">Join Room</button>
                    <div class="error-message" style="display: none; color: #ff3366; margin-top: 1rem; font-size: 0.85rem; text-align: center;"></div>
                </div>
            </div>
        `;
        this.bindEvents();
    }

    private showCreateRoom(): void {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="lobby-card">
                <h2 class="lobby-title">Create Room</h2>
                
                <div class="lobby-form">
                    <div class="input-group">
                        <label>Set Password</label>
                        <input type="password" id="create-password" class="lobby-input" placeholder="Secret Password">
                    </div>
                    
                    <button id="btn-create-submit" class="lobby-btn">Create & Host</button>
                    <button id="btn-back" class="lobby-btn" style="background: transparent; border: 1px solid var(--border-dim); color: var(--text-dim);">Back</button>
                    <div class="error-message" style="display: none; color: #ff3366; margin-top: 1rem; font-size: 0.85rem; text-align: center;"></div>
                </div>
            </div>
        `;
        this.bindCreateEvents();
    }

    private showWaitingRoom(roomId: string, isHost: boolean = false): void {
        if (!this.container) return;

        const roleText = isHost ? 'Host (You)' : 'Guest (You)';
        const startBtnState = isHost ? '' : 'disabled style="opacity: 0.5; cursor: not-allowed;"';
        const startBtnText = isHost ? 'Start Race' : 'Waiting for Host...';

        this.container.innerHTML = `
             <div class="lobby-card">
                <h2 class="lobby-title">Waiting for Players</h2>
                <p class="status-text">Share this code with your friends:</p>
                
                <div class="room-code-display">${roomId}</div>
                
                <div class="lobby-form">
                     <p style="color: var(--text-dim); font-size: 0.9rem;">Joined: ${roleText}</p>
                     <button id="btn-start-race" class="lobby-btn" ${startBtnState}>${startBtnText}</button>
                     <button id="btn-leave" class="lobby-btn" style="background: transparent; border: 1px solid var(--border-dim); color: var(--text-dim); margin-top: 0.5rem;">Leave Room</button>
                </div>
            </div>
        `;
        this.bindWaitingRoomEvents();
    }

    private bindWaitingRoomEvents(): void {
        const leaveBtn = document.getElementById('btn-leave');
        leaveBtn?.addEventListener('click', () => {
            if (this.statusUnsubscribe) {
                this.statusUnsubscribe();
                this.statusUnsubscribe = null;
            }
            // Import stopped manually to avoid circular but it's handled in main
            // For now we just refresh or trigger window event? 
            // Better: call stopMultiplayerSync exported from main
            import('../main').then(m => m.stopMultiplayerSync());
            this.showMainMenu();
        });
    }

    private bindEvents(): void {
        const createViewBtn = document.getElementById('btn-create-view');
        createViewBtn?.addEventListener('click', () => this.showCreateRoom());

        const joinBtn = document.getElementById('btn-join');
        joinBtn?.addEventListener('click', async () => {
            const codeInput = document.getElementById('join-code') as HTMLInputElement;
            const passInput = document.getElementById('join-password') as HTMLInputElement;

            const roomId = codeInput?.value.toUpperCase().trim() || '';
            const password = passInput?.value || '';

            if (!roomId) {
                alert('Please enter a Room Code');
                return;
            }

            try {
                this.clearError();
                (joinBtn as HTMLButtonElement).disabled = true;
                joinBtn!.textContent = 'Joining...';

                await roomManager.joinRoom(roomId, password);
                startMultiplayerSync(roomId);
                this.showWaitingRoom(roomId, false);
                this.setupRaceCoordination(roomId, false);
            } catch (error) {
                console.error(error);
                const message = error instanceof Error ? error.message : 'Failed to join room';
                this.showError(message);
                (joinBtn as HTMLButtonElement).disabled = false;
                joinBtn!.textContent = 'Join Room';
            }
        });
    }

    private statusUnsubscribe: (() => void) | null = null;

    private setupRaceCoordination(roomId: string, isHost: boolean): void {
        // Cleanup previous listener if exists
        if (this.statusUnsubscribe) {
            this.statusUnsubscribe();
            this.statusUnsubscribe = null;
        }

        // 1. Listen for Start Button (Host only)
        if (isHost) {
            const startBtn = document.getElementById('btn-start-race');
            startBtn?.addEventListener('click', async () => {
                try {
                    startBtn.textContent = 'Starting...';
                    (startBtn as HTMLButtonElement).disabled = true;
                    await roomManager.startRace(roomId);
                } catch (e) {
                    console.error(e);
                    alert('Failed to start race');
                    startBtn.textContent = 'Start Race';
                    (startBtn as HTMLButtonElement).disabled = false;
                }
            });
        }

        // 2. Listen for Room Status Changes
        this.statusUnsubscribe = roomManager.listenToStatus(roomId, (status) => {
            if (status === 'COUNTDOWN') {
                this.handleCountdownStart();
            }
        });
    }

    private handleCountdownStart(): void {
        const countdown = new CountdownOverlay(() => {
            // On Countdown Complete:
            this.hide(); // Hide Lobby
            gameStateManager.startRace(); // Start Game Physics
        });
        countdown.start();
    }

    private bindCreateEvents(): void {
        const backBtn = document.getElementById('btn-back');
        backBtn?.addEventListener('click', () => this.showMainMenu());

        const createSubmitBtn = document.getElementById('btn-create-submit');
        createSubmitBtn?.addEventListener('click', async () => {
            const passwordInput = document.getElementById('create-password') as HTMLInputElement;
            const password = passwordInput?.value || '';

            try {
                this.clearError();
                (createSubmitBtn as HTMLButtonElement).disabled = true;
                createSubmitBtn!.textContent = 'Creating...';

                const roomId = await roomManager.createRoom(password);
                startMultiplayerSync(roomId);
                this.showWaitingRoom(roomId, true);
                this.setupRaceCoordination(roomId, true);
            } catch (error) {
                console.error(error);
                this.showError('Failed to create room. See console.');
                (createSubmitBtn as HTMLButtonElement).disabled = false;
                createSubmitBtn!.textContent = 'Create & Host';
            }
        });
    }

    public hide(): void {
        if (this.container) this.container.style.display = 'none';
        if (this.statusUnsubscribe) {
            this.statusUnsubscribe();
            this.statusUnsubscribe = null;
        }
    }

    public show(): void {
        if (this.container) this.container.style.display = 'flex';
    }
}
