const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Listen for timer start command from tray
    onStartTimer: (callback) => ipcRenderer.on('start-timer', callback),

    // Platform info
    platform: process.platform,

    // App version
    getVersion: () => ipcRenderer.invoke('get-version'),
});
