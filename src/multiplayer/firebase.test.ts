import { describe, it, expect } from 'vitest';
import { app, database, setupConnectionMonitor } from './firebase';

describe('Firebase Initialization', () => {
    it('should export initialized app and database instances', () => {
        expect(app).toBeDefined();
        expect(database).toBeDefined();
    });

    it('should export setupConnectionMonitor function', () => {
        expect(setupConnectionMonitor).toBeDefined();
        expect(typeof setupConnectionMonitor).toBe('function');
    });
});
