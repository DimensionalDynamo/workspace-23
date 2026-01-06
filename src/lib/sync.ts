import { toast } from 'sonner';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import type { AppState } from './store';

// -----------------------------------------------------------------------------
// Firebase Auto-Sync Configuration
// -----------------------------------------------------------------------------

const firebaseConfig = {
    apiKey: "AIzaSyBVKPWdLc1XGr11iiBvQmcJ49vUB4y3pkU",
    authDomain: "focusflow-966b5.firebaseapp.com",
    projectId: "focusflow-966b5",
    storageBucket: "focusflow-966b5.firebasestorage.app",
    messagingSenderId: "40101788198",
    appId: "1:40101788198:web:4d4a006a19dc8a188dc4e7"
};

// Initialize Firebase (Singleton pattern to prevent re-init errors)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Collection and Document ID for storing user data
// In a real multi-user app, you would use the user's Auth uid here.
// For now, we'll use a hardcoded "default_user" or a stored ID.
const USER_DOC_ID = 'default_user_data';
const COLLECTION_NAME = 'user_data';

export type SyncedData = {
    timestamp: number;
    data: Partial<AppState>;
    device: string;
    lastUpdated: string;
};

// Helper to gather all relevant state for syncing
export const gatherStateForSync = (state: AppState): Partial<AppState> => {
    const {
        tasks, habits, studySessions, testResults, syllabusProgress, topics,
        revisionTasks, resources, badges, aiInsights, todayStudyTime,
        currentStreak, notifications, dailyRoutine, customMusicTracks,
        pomodoroBackground, selectedMusicTrack, pomodoroWorkTime,
        pomodoroShortBreak, pomodoroLongBreak, autoStartPomodoro,
        autoLogStudyTime, aiEnabled, aiEngine, autoSyncEnabled, lastSyncTimestamp,
        userName, currentScreen
    } = state;

    return {
        tasks, habits, studySessions, testResults, syllabusProgress, topics,
        revisionTasks, resources, badges, aiInsights, todayStudyTime,
        currentStreak, notifications, dailyRoutine, customMusicTracks,
        pomodoroBackground, selectedMusicTrack, pomodoroWorkTime,
        pomodoroShortBreak, pomodoroLongBreak, autoStartPomodoro,
        autoLogStudyTime, aiEnabled, aiEngine, autoSyncEnabled, lastSyncTimestamp,
        userName, currentScreen
    };
}

/**
 * Saves the entire application state to Firebase.
 */
export const saveStateToCloud = async (appState: AppState): Promise<boolean> => {
    try {
        const dataToSync: SyncedData = {
            timestamp: Date.now(),
            data: gatherStateForSync(appState),
            device: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            lastUpdated: new Date().toISOString()
        };

        const docRef = doc(db, COLLECTION_NAME, USER_DOC_ID);
        await setDoc(docRef, dataToSync);

        console.log("Sync successful to Firebase:", new Date().toLocaleTimeString());
        return true;
    } catch (error) {
        console.error("Error saving to Firebase:", error);
        toast.error("Sync failed: Check console for network errors.");
        return false;
    }
};

/**
 * Loads the application state from Firebase.
 */
export const loadStateFromCloud = async (): Promise<SyncedData | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, USER_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SyncedData;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error loading from Firebase:", error);
        return null;
    }
};
