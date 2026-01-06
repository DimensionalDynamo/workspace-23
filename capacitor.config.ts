import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.studyflow.app',
    appName: 'StudyFlow',
    webDir: 'out',
    server: {
        androidScheme: 'https',
        // For development, you can use your local server
        // url: 'http://192.168.x.x:3000',
        // cleartext: true,
    },
    android: {
        backgroundColor: '#0a0a0f',
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: false,
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#0a0a0f',
            showSpinner: false,
            androidSpinnerStyle: 'small',
            spinnerColor: '#8b5cf6',
        },
    },
};

export default config;
