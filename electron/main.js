const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

// Auto-launch setup
let AutoLaunch;
try {
    AutoLaunch = require('auto-launch');
} catch (e) {
    console.log('auto-launch not available');
}

let mainWindow;
let tray;
let isQuitting = false;

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, '../public/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        titleBarStyle: 'default',
        backgroundColor: '#0a0a0f',
        show: false,
    });

    // Load the app
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // Load from static export
        mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Minimize to tray instead of closing
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
            return false;
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTray() {
    // Create tray icon
    const iconPath = path.join(__dirname, '../public/icon.png');
    let trayIcon;

    try {
        trayIcon = nativeImage.createFromPath(iconPath);
        trayIcon = trayIcon.resize({ width: 16, height: 16 });
    } catch (e) {
        // Use empty icon if not found
        trayIcon = nativeImage.createEmpty();
    }

    tray = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open StudyFlow',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        {
            label: 'Start Focus Timer',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.webContents.send('start-timer');
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('StudyFlow');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.show();
                mainWindow.focus();
            }
        }
    });
}

function setupAutoLaunch() {
    if (!AutoLaunch) return;

    const autoLauncher = new AutoLaunch({
        name: 'StudyFlow',
        path: app.getPath('exe'),
    });

    // Enable auto-launch by default
    autoLauncher.isEnabled().then((isEnabled) => {
        if (!isEnabled) {
            autoLauncher.enable();
            console.log('Auto-launch enabled');
        }
    }).catch((err) => {
        console.error('Auto-launch error:', err);
    });
}

// App ready
app.whenReady().then(() => {
    createWindow();
    createTray();
    setupAutoLaunch();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle before-quit
app.on('before-quit', () => {
    isQuitting = true;
});
