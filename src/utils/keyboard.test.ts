import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InputManager } from './keyboard';

describe('InputManager', () => {
    let inputManager: InputManager;
    let mockCallback: any;

    beforeEach(() => {
        inputManager = new InputManager();
        mockCallback = vi.fn();
    });

    afterEach(() => {
        inputManager.destroy();
    });

    describe('Observer Pattern', () => {
        it('should allow subscribing to key events', () => {
            const unsubscribe = inputManager.subscribe(mockCallback);
            expect(unsubscribe).toBeTypeOf('function');
        });

        it('should notify subscribers when valid keys (1-4) are pressed', () => {
            inputManager.subscribe(mockCallback);

            const event1 = new KeyboardEvent('keydown', { key: '1' });
            window.dispatchEvent(event1);
            expect(mockCallback).toHaveBeenCalledWith('1');

            const event2 = new KeyboardEvent('keydown', { key: '2' });
            window.dispatchEvent(event2);
            expect(mockCallback).toHaveBeenCalledWith('2');

            const event3 = new KeyboardEvent('keydown', { key: '3' });
            window.dispatchEvent(event3);
            expect(mockCallback).toHaveBeenCalledWith('3');

            const event4 = new KeyboardEvent('keydown', { key: '4' });
            window.dispatchEvent(event4);
            expect(mockCallback).toHaveBeenCalledWith('4');

            expect(mockCallback).toHaveBeenCalledTimes(4);
        });

        it('should NOT notify subscribers for invalid keys', () => {
            inputManager.subscribe(mockCallback);

            const invalidKeys = ['5', 'a', 'Enter', 'Escape', 'ArrowUp'];
            invalidKeys.forEach(key => {
                const event = new KeyboardEvent('keydown', { key });
                window.dispatchEvent(event);
            });

            expect(mockCallback).not.toHaveBeenCalled();
        });

        it('should support multiple subscribers', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            inputManager.subscribe(callback1);
            inputManager.subscribe(callback2);

            const event = new KeyboardEvent('keydown', { key: '1' });
            window.dispatchEvent(event);

            expect(callback1).toHaveBeenCalledWith('1');
            expect(callback2).toHaveBeenCalledWith('1');
        });

        it('should stop notifying after unsubscribe', () => {
            const unsubscribe = inputManager.subscribe(mockCallback);

            const event1 = new KeyboardEvent('keydown', { key: '1' });
            window.dispatchEvent(event1);
            expect(mockCallback).toHaveBeenCalledWith('1');

            mockCallback.mockClear();
            unsubscribe();

            const event2 = new KeyboardEvent('keydown', { key: '2' });
            window.dispatchEvent(event2);
            expect(mockCallback).not.toHaveBeenCalled();
        });
    });

    describe('Default Browser Action Prevention', () => {
        it('should prevent default browser actions for keys 1-4', () => {
            const event1 = new KeyboardEvent('keydown', { key: '1', cancelable: true });
            const preventDefaultSpy = vi.spyOn(event1, 'preventDefault');
            window.dispatchEvent(event1);
            expect(preventDefaultSpy).toHaveBeenCalled();

            const event2 = new KeyboardEvent('keydown', { key: '2', cancelable: true });
            const preventDefaultSpy2 = vi.spyOn(event2, 'preventDefault');
            window.dispatchEvent(event2);
            expect(preventDefaultSpy2).toHaveBeenCalled();

            const event3 = new KeyboardEvent('keydown', { key: '3', cancelable: true });
            const preventDefaultSpy3 = vi.spyOn(event3, 'preventDefault');
            window.dispatchEvent(event3);
            expect(preventDefaultSpy3).toHaveBeenCalled();

            const event4 = new KeyboardEvent('keydown', { key: '4', cancelable: true });
            const preventDefaultSpy4 = vi.spyOn(event4, 'preventDefault');
            window.dispatchEvent(event4);
            expect(preventDefaultSpy4).toHaveBeenCalled();
        });

        it('should NOT prevent default for invalid keys', () => {
            const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
            const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);
            expect(preventDefaultSpy).not.toHaveBeenCalled();
        });
    });

    describe('Cleanup', () => {
        it('should remove event listeners when destroyed', () => {
            inputManager.subscribe(mockCallback);
            inputManager.destroy();

            const event = new KeyboardEvent('keydown', { key: '1' });
            window.dispatchEvent(event);

            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
});
