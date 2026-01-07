import { PhysicsEngine } from './physics';
import type { IPhysicsState } from './physics';
import { GAME_CONSTANTS } from './constants';

export interface Question {
    id: string;
    text: string;
    answers: string[];
    correctIndex: number;
    points: number;
}

export interface GameState {
    currentQuestion: Question | null;
    holdingValue: number; // Accumulated points not yet allocated
    feedbackState: 'idle' | 'correct' | 'wrong';
    isAllocationActive: boolean;
    isGameActive: boolean;
    lastInput: { key: string; timestamp: number; sequenceId: number } | null;
    frictionSpikeEnd: number;
    isRaceFinished: boolean;
    raceStartTime: number;
    raceEndTime: number | null;
}

export type StateListener = (state: GameState) => void;

export const PHYSICS_VARIABLES: (keyof IPhysicsState)[] = ['pos', 'vel', 'acc', 'jerk'];

export class GameStateManager {
    private state!: GameState;
    private listeners: Set<StateListener> = new Set();
    private sequenceCounter: number = 0;
    private engine!: PhysicsEngine;

    private questions: Question[] = [];
    private currentQuestionIndex: number = -1;

    constructor() {
        // Initialization will be completed via setEngine in main.ts
        this.resetState();
    }

    /**
     * Connects a physics engine to the state manager
     */
    public setEngine(engine: PhysicsEngine): void {
        this.engine = engine;
    }

    /**
     * Gets the latest state from the physics engine
     */
    public getStateFromEngine(): IPhysicsState | null {
        return this.engine ? this.engine.getState() : null;
    }

    private resetState(): void {
        this.state = {
            currentQuestion: null,
            holdingValue: 0,
            feedbackState: 'idle',
            isAllocationActive: false,
            isGameActive: false,
            lastInput: null,
            frictionSpikeEnd: 0,
            isRaceFinished: false,
            raceStartTime: 0,
            raceEndTime: null
        };
        this.notify();
    }

    /**
     * Starts the race timer and enables gameplay
     */
    public startRace(): void {
        this.setState({
            isGameActive: true,
            raceStartTime: Date.now()
        });
    }

    /**
     * Initializes the manager with a set of questions
     */
    setQuestions(questions: Question[]): void {
        this.questions = questions;
        if (this.questions.length > 0) {
            this.nextQuestion();
        }
    }

    /**
     * Cycles to the next question in the bank
     */
    private nextQuestion(): void {
        if (this.questions.length === 0) return;

        this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;
        this.state.currentQuestion = this.questions[this.currentQuestionIndex];
        this.state.feedbackState = 'idle';
        this.notify();
    }

    /**
     * Submits an answer choice (0-3)
     */
    submitAnswer(answerIndex: number): void {
        if (this.state.isRaceFinished) return;

        // Ignore if already showing feedback or no active question
        if (this.state.feedbackState !== 'idle' || !this.state.currentQuestion) {
            return;
        }

        if (!this.engine) {
            console.error('GameStateManager: PhysicsEngine not connected. Use setEngine() before submitting answers.');
            return;
        }

        const isCorrect = answerIndex === this.state.currentQuestion.correctIndex;

        if (isCorrect) {
            this.state.feedbackState = 'correct';
            this.state.holdingValue += this.state.currentQuestion.points;

            // Auto-transition to allocation after a short delay
            setTimeout(() => {
                this.state.feedbackState = 'idle';
                this.state.isAllocationActive = true;
                this.notify();
            }, GAME_CONSTANTS.FEEDBACK_DELAY_MS);
        } else {
            this.state.feedbackState = 'wrong';
            // Trigger 2.0s Friction Spike Penalty
            this.state.frictionSpikeEnd = Date.now() + GAME_CONSTANTS.FRICTION_SPIKE_DURATION_MS;
            this.notify();

            // Wrong answer penalty cycle
            setTimeout(() => {
                this.nextQuestion();
            }, GAME_CONSTANTS.FEEDBACK_DELAY_MS);

            // Ensure the UI updates when the friction spike duration expires
            // This prevents the "SYSTEM REBOOT" message from hanging until the next interaction
            setTimeout(() => {
                this.notify();
            }, GAME_CONSTANTS.FRICTION_SPIKE_DURATION_MS + 10);
        }
    }

    /**
     * Checks if the friction spike penalty is currently active
     */
    public isFrictionSpikeActive(): boolean {
        return Date.now() < this.state.frictionSpikeEnd;
    }

    /**
     * Strategic Allocation Logic
     */
    public allocatePoints(answerIndex: number): void {
        if (this.state.isRaceFinished) return;

        if (!this.state.isAllocationActive || this.state.holdingValue <= 0) {
            return;
        }

        if (!this.engine) {
            console.error('GameStateManager: PhysicsEngine not connected. Use setEngine() before allocating points.');
            return;
        }

        const targetVar = PHYSICS_VARIABLES[answerIndex];

        if (targetVar) {
            this.engine.addValue(targetVar, this.state.holdingValue);
            this.state.holdingValue = 0;
            this.state.isAllocationActive = false;

            this.notify();

            // AC3: 500ms delay for visual confirmation after allocation
            setTimeout(() => {
                this.nextQuestion();
            }, 500);
        }
    }

    /**
     * Subscribe to state changes
     * @param listener Callback function
     * @returns Unsubscribe function
     */
    subscribe(listener: StateListener): () => void {
        this.listeners.add(listener);
        // Send current state immediately upon subscription
        listener(this.state);

        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Update part of the state and notify listeners
     * @param partialState Partial state update
     */
    setState(partialState: Partial<GameState>): void {
        this.state = { ...this.state, ...partialState };
        this.notify();
    }

    getState(): GameState {
        return { ...this.state };
    }

    private notify(): void {
        this.listeners.forEach(listener => listener(this.state));
    }

    /**
     * Handle input from InputManager
     * @param key The key pressed
     */
    handleInput(key: string): void {
        this.sequenceCounter++;
        this.setState({
            lastInput: {
                key,
                timestamp: Date.now(),
                sequenceId: this.sequenceCounter
            }
        });
    }
}

export const gameStateManager = new GameStateManager();
