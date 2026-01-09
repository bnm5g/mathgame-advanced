import { getAuth, signInAnonymously, type User } from 'firebase/auth';
import { app } from './firebase';

export const auth = getAuth(app);

export const authenticateAnonymously = async (): Promise<User> => {
    try {
        const userCredential = await signInAnonymously(auth);
        return userCredential.user;
    } catch (error) {
        console.error("Error signing in anonymously:", error);
        throw error;
    }
};


export const waitForAuth = (): Promise<User> => {
    return new Promise((resolve) => {
        if (auth.currentUser) {
            resolve(auth.currentUser);
        } else {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    unsubscribe();
                    resolve(user);
                }
            });
        }
    });
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
