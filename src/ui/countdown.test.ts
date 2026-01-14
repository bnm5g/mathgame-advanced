import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CountdownOverlay } from './countdown';

describe('CountdownOverlay', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'game-app';
        document.body.appendChild(container);
        vi.useFakeTimers();
    });

    afterEach(() => {
        document.body.removeChild(container);
        vi.useRealTimers();
    });

    it('should show countdown sequence 3-2-1-GO', () => {
        const onComplete = vi.fn();
        const countdown = new CountdownOverlay(onComplete);

        countdown.start();

        // Should show "3"
        expect(document.querySelector('.countdown-text')?.textContent).toBe('3');

        // Advance 1 second
        vi.advanceTimersByTime(1000);
        expect(document.querySelector('.countdown-text')?.textContent).toBe('2');

        // Advance 1 second
        vi.advanceTimersByTime(1000);
        expect(document.querySelector('.countdown-text')?.textContent).toBe('1');

        // Advance 1 second
        vi.advanceTimersByTime(1000);
        expect(document.querySelector('.countdown-text')?.textContent).toBe('GO!');

        // Callback should be fired
        expect(onComplete).toHaveBeenCalled();
    });

    it('should remove itself from DOM shortly after completion', () => {
        const countdown = new CountdownOverlay(() => { });
        countdown.start();

        // Fast forward to end of countdown + cleanup delay (e.g., 500ms)
        vi.advanceTimersByTime(3500);

        // Should be gone from DOM
        expect(document.querySelector('.countdown-overlay')).toBeNull();
    });
});
