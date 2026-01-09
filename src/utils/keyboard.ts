/**
 * InputManager - Handles keyboard input for the game
 * Captures keys 1-4 and notifies subscribers using Observer pattern
 */

type KeyCallback = (key: string) => void;

export class InputManager {
    private listeners: Set<KeyCallback> = new Set();
    private boundHandler: (event: KeyboardEvent) => void;
    private readonly validKeys = new Set(['1', '2', '3', '4']);

    constructor() {
        // Bind the handler so we can remove it later
        this.boundHandler = this.handleKeyDown.bind(this);
        window.addEventListener('keydown', this.boundHandler);
    }

    /**
     * Subscribe to keyboard events
     * @param callback Function to call when valid keys (1-4) are pressed
     * @returns Unsubscribe function
     */
    subscribe(callback: KeyCallback): () => void {
        this.listeners.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Handle keydown events
     * @param event Keyboard event
     */
    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.key;

        // Only handle keys 1-4
        if (!this.validKeys.has(key)) {
            return;
        }

        // Ignore input if user is typing in a form field
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
            return;
        }

        // Prevent default browser actions for game keys
        event.preventDefault();

        // Notify all subscribers
        this.notify(key);
    }

    /**
     * Notify all subscribers of a key press
     * @param key The key that was pressed
     */
    private notify(key: string): void {
        this.listeners.forEach(callback => callback(key));
    }

    /**
     * Clean up event listeners
     * Call this when the InputManager is no longer needed
     */
    destroy(): void {
        window.removeEventListener('keydown', this.boundHandler);
        this.listeners.clear();
    }
}
