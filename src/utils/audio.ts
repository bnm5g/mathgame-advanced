export class AudioManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private resonanceGain: GainNode | null = null;
    private resonanceOsc: OscillatorNode | null = null;
    private isMuted: boolean = false;
    private initialized: boolean = false;

    constructor() {
        // We don't initialize here to respect browser auto-play policies
    }

    private init(): void {
        if (this.initialized) return;

        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = this.isMuted ? 0 : 0.5;

        // Setup Resonance Hum Layer
        this.resonanceGain = this.ctx.createGain();
        this.resonanceGain.gain.value = 0;
        this.resonanceGain.connect(this.masterGain);

        this.initialized = true;
    }

    public playSuccess(): void {
        this.init();
        if (!this.ctx || !this.masterGain || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.1); // E6

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    public playError(): void {
        this.init();
        if (!this.ctx || !this.masterGain || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, this.ctx.currentTime); // A2
        osc.frequency.linearRampToValueAtTime(55, this.ctx.currentTime + 0.4); // A1

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    public playAllocation(): void {
        this.init();
        if (!this.ctx || !this.masterGain || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    public startResonanceHum(): void {
        this.init();
        if (!this.ctx || !this.resonanceGain || this.isMuted) return;

        if (this.resonanceOsc) return; // Already playing

        this.resonanceOsc = this.ctx.createOscillator();
        this.resonanceOsc.type = 'sine';
        this.resonanceOsc.frequency.setValueAtTime(110, this.ctx.currentTime); // Deep A2

        this.resonanceOsc.connect(this.resonanceGain);
        this.resonanceGain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 1.0); // Fade in

        this.resonanceOsc.start();
    }

    public stopResonanceHum(): void {
        if (!this.ctx || !this.resonanceGain || !this.resonanceOsc) return;

        const osc = this.resonanceOsc;
        this.resonanceGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5); // Fade out

        setTimeout(() => {
            osc.stop();
            if (this.resonanceOsc === osc) this.resonanceOsc = null;
        }, 600);
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 0.5;
        }
        return this.isMuted;
    }

    public getIsMuted(): boolean {
        return this.isMuted;
    }

    public resumeContext(): void {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
}

export const audioManager = new AudioManager();
