import { roomManager } from '../multiplayer/rooms';
import { startMultiplayerSync } from '../main';

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
                </div>
            </div>
        `;
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
                (joinBtn as HTMLButtonElement).disabled = true;
                joinBtn!.textContent = 'Joining...';

                await roomManager.joinRoom(roomId, password);
                startMultiplayerSync(roomId);
                this.showWaitingRoom(roomId, false);
            } catch (error: any) {
                console.error(error);
                alert(error.message || 'Failed to join room');
                (joinBtn as HTMLButtonElement).disabled = false;
                joinBtn!.textContent = 'Join Room';
            }
        });
    }

    private bindCreateEvents(): void {
        const backBtn = document.getElementById('btn-back');
        backBtn?.addEventListener('click', () => this.showMainMenu());

        const createSubmitBtn = document.getElementById('btn-create-submit');
        createSubmitBtn?.addEventListener('click', async () => {
            const passwordInput = document.getElementById('create-password') as HTMLInputElement;
            const password = passwordInput?.value || '';

            try {
                (createSubmitBtn as HTMLButtonElement).disabled = true;
                createSubmitBtn!.textContent = 'Creating...';

                const roomId = await roomManager.createRoom(password);
                startMultiplayerSync(roomId);
                this.showWaitingRoom(roomId, true);
            } catch (error) {
                console.error(error);
                alert('Failed to create room. See console.');
                (createSubmitBtn as HTMLButtonElement).disabled = false;
                createSubmitBtn!.textContent = 'Create & Host';
            }
        });
    }

    public hide(): void {
        if (this.container) this.container.style.display = 'none';
    }

    public show(): void {
        if (this.container) this.container.style.display = 'flex';
    }
}
