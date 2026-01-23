import { GameStateManager, PHYSICS_VARIABLES } from '../game/state';
import type { GameState } from '../game/state';
import { audioManager } from '../utils/audio';
import { auth } from '../multiplayer/auth';

export class HUDManager {
    private container: HTMLElement | null = null;
    private unsubscribe: (() => void) | null = null;
    private gameStateManager: GameStateManager;
    private lastProcessedSequenceId: number = 0;
    private lastAnnouncementTimestamp: number = 0;
    private announcementRegion: HTMLElement | null = null;

    constructor(gameStateManager: GameStateManager) {
        this.gameStateManager = gameStateManager;
        this.initializeDOM();

        // Subscribe to state updates
        this.unsubscribe = this.gameStateManager.subscribe((state) => this.updateView(state));
    }

    private initializeDOM(): void {
        const app = document.getElementById('app') || document.body;

        this.container = document.createElement('div');
        this.container.id = 'hud-overlay';
        this.container.className = 'hud-overlay';

        this.container.innerHTML = `
            <div class="hud-header">
                <button id="sound-toggle" class="sound-toggle" aria-label="Toggle Sound">
                    <span class="icon">🔊</span>
                </button>
            </div>
            <div class="question-container" role="region" aria-label="Math Question">
                <h2 class="question-text" aria-live="assertive">Waiting for race to start...</h2>
                <div class="answers-grid" role="group" aria-label="Answer choices">
                    <button class="answer-option" data-key="1" aria-label="Answer choice 1"></button>
                    <button class="answer-option" data-key="2" aria-label="Answer choice 2"></button>
                    <button class="answer-option" data-key="3" aria-label="Answer choice 3"></button>
                    <button class="answer-option" data-key="4" aria-label="Answer choice 4"></button>
                </div>
            </div>
            <div id="hud-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
        `;

        app.appendChild(this.container);
        this.announcementRegion = this.container.querySelector('#hud-announcer');

        this.addInteractionListeners();
    }

    private addInteractionListeners(): void {
        const buttons = this.container?.querySelectorAll('.answer-option');
        buttons?.forEach((btn) => {
            const handleInput = () => {
                const key = btn.getAttribute('data-key');
                if (!key) return;

                const index = parseInt(key) - 1;
                const state = this.gameStateManager.getState();

                if (state.isAllocationActive) {
                    this.gameStateManager.allocatePoints(index);
                } else if (state.currentQuestion) {
                    this.gameStateManager.submitAnswer(index);
                }

                audioManager.playAllocation(); // Subtle click feedback
                this.gameStateManager.handleInput(key);
            };

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handleInput();
            });

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleInput();
            }, { passive: false });
        });

        // Sound Toggle
        const soundBtn = this.container?.querySelector('#sound-toggle');
        soundBtn?.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            audioManager.resumeContext(); // Needed for first interaction
            const isMuted = audioManager.toggleMute();
            const icon = soundBtn.querySelector('.icon');
            if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
            soundBtn.setAttribute('aria-label', isMuted ? 'Unmute Sound' : 'Mute Sound');
        });
    }

    private updateView(state: GameState): void {
        if (!this.container) return;

        // Visibility
        this.container.style.display = (state.isGameActive || state.isRaceFinished) ? 'flex' : 'none';

        // Feedback State
        this.container.classList.remove('correct', 'wrong');
        if (state.feedbackState !== 'idle') {
            this.container.classList.add(state.feedbackState);
        }

        // Allocation Phase Class
        this.container.classList.toggle('allocation-phase', state.isAllocationActive);

        // Friction Spike Penalty Class
        const isFrictionActive = this.gameStateManager.isFrictionSpikeActive();
        this.container.classList.toggle('friction-spike', isFrictionActive);

        // Finish State Class
        this.container.classList.toggle('race-finished', state.isRaceFinished);

        // Resonance Mode Class
        this.container.classList.toggle('resonance-active', state.isResonanceActive);
        document.documentElement.classList.toggle('resonance-active', state.isResonanceActive);

        // Question or Allocation Details
        const questionText = this.container.querySelector('.question-text');
        const buttons = this.container.querySelectorAll('.answer-option');

        if (state.isRaceFinished) {
            const finalTimeMs = (state.raceEndTime || Date.now()) - state.raceStartTime;
            const minutes = Math.floor(finalTimeMs / 60000);
            const seconds = Math.floor((finalTimeMs % 60000) / 1000);
            const ms = finalTimeMs % 1000;
            const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;

            if (questionText) {
                const winnerName = state.winner === auth.currentUser?.uid ? 'YOU' : 'REMOTE PLAYER';
                // In a real app we'd have a UID-to-Username map
                questionText.textContent = `RACE COMPLETE - WINNER: ${winnerName} - FINAL TIME: ${formattedTime}`;
                questionText.setAttribute('aria-label', `Race complete. The winner was ${winnerName}. Your final time was ${minutes} minutes, ${seconds} seconds and ${ms} milliseconds.`);
            }
            buttons.forEach(btn => (btn as HTMLElement).style.visibility = 'hidden');
        } else if (isFrictionActive) {
            if (questionText) questionText.textContent = 'SYSTEM REBOOT :: DRAG ACTIVE';
            buttons.forEach(btn => (btn as HTMLElement).style.visibility = 'visible');
        } else if (state.isAllocationActive) {
            if (questionText) questionText.textContent = 'ALLOCATE POWER';
            buttons.forEach(btn => (btn as HTMLElement).style.visibility = 'visible');

            const allocationChoices = PHYSICS_VARIABLES.map(v => v.toUpperCase() === 'POS' ? 'POSITION' : v.toUpperCase() === 'VEL' ? 'VELOCITY' : v.toUpperCase());
            buttons.forEach((btn, index) => {
                btn.textContent = allocationChoices[index] || '';

                // Disable if it's the same as the last allocated index
                const isLastAllocated = state.lastAllocatedIndex === index;
                (btn as HTMLButtonElement).disabled = isLastAllocated;
                (btn as HTMLElement).classList.toggle('disabled-choice', isLastAllocated);
            });
        } else if (state.currentQuestion) {
            if (questionText) questionText.textContent = state.currentQuestion.text;
            buttons.forEach(btn => {
                (btn as HTMLElement).style.visibility = 'visible';
                (btn as HTMLButtonElement).disabled = false;
                (btn as HTMLElement).classList.remove('disabled-choice');
            });

            buttons.forEach((btn, index) => {
                const answer = state.currentQuestion?.answers[index];
                if (answer) btn.textContent = answer;
            });
        }

        // Handle Input Highlight via State using Sequence ID
        if (state.lastInput && state.lastInput.sequenceId > this.lastProcessedSequenceId) {
            this.highlightKey(state.lastInput.key);
            this.lastProcessedSequenceId = state.lastInput.sequenceId;

            // Add focus to the button for accessibility
            const btn = this.container.querySelector(`.answer-option[data-key="${state.lastInput.key}"]`) as HTMLElement;
            if (btn) {
                btn.focus();
            }
        }

        // Handle Announcements (Audio & Visual)
        if (state.announcement && state.announcement.timestamp > this.lastAnnouncementTimestamp) {
            this.lastAnnouncementTimestamp = state.announcement.timestamp;
            this.handleAnnouncement(state.announcement);
            this.triggerAudio(state.announcement.message);
        }

        // Handle Resonance Hum
        if (state.isResonanceActive) {
            audioManager.startResonanceHum();
        } else {
            audioManager.stopResonanceHum();
        }
    }

    private triggerAudio(message: string): void {
        const msg = message.toLowerCase();
        if (msg.includes('correct')) {
            audioManager.playSuccess();
        } else if (msg.includes('wrong') || msg.includes('lost') || msg.includes('broken')) {
            audioManager.playError();
        } else if (msg.includes('increased')) {
            audioManager.playAllocation();
        }
    }

    private handleAnnouncement(announcement: { message: string, priority: 'polite' | 'assertive' }): void {
        if (!this.announcementRegion) return;

        // Temporarily change priority if needed
        this.announcementRegion.setAttribute('aria-live', announcement.priority);
        this.announcementRegion.textContent = announcement.message;

        // Clear after a while to allow same message twice
        setTimeout(() => {
            if (this.announcementRegion) this.announcementRegion.textContent = '';
        }, 1000);
    }

    // Visual effect only
    private highlightKey(key: string): void {
        if (!this.container) return;

        const btn = this.container.querySelector(`.answer-option[data-key="${key}"]`);
        if (btn) {
            // Remove active class from all
            this.container.querySelectorAll('.answer-option').forEach(b => b.classList.remove('active'));
            // Add to current
            btn.classList.add('active');

            // Remove after short delay for visual feedback
            setTimeout(() => {
                btn.classList.remove('active');
            }, 200);
        }
    }

    public destroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        if (this.container) {
            this.container.remove();
        }
    }
}
