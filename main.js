const { app, BrowserWindow, clipboard, ipcMain, Tray, Menu, globalShortcut } = require('electron');
const fs = require('fs');
const path = require('path');

let tray = null;
let win;
let lastClipboardText = '';
let history = [];

// Path to our storage file, e.g. .../AppData/Roaming/echo-paste/history.json
const historyFilePath = path.join(app.getPath('userData'), 'history.json');

const EXPIRATION_MS = 24 * 60 * 60 * 1000; // TEMP: 15 seconds, for testing

function loadHistory() {
    try {
        if (fs.existsSync(historyFilePath)) {
            const raw = fs.readFileSync(historyFilePath, 'utf-8');
            history = JSON.parse(raw);
        }
    } catch (err) {
        console.error('Failed to load history:', err);
        history = [];
    }
}

function saveHistory() {
    try {
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
    } catch (err) {
    console.error('Failed to save history:', err);
    }
}

function notifyRenderer() {
    if (win) win.webContents.send('history-updated');
}

function addToHistory(text) {
    const entry = {
        id: Date.now(),
        text: text,
        timestamp: Date.now(),
    };

  // Add newest entry at the top of the list
    history.unshift(entry);
    saveHistory();
    notifyRenderer();

    console.log('Saved new entry. Total entries:', history.length);
}

function cleanExpiredEntries() {
    const now = Date.now();
    const originalLength = history.length;

    history = history.filter((entry) => (now - entry.timestamp) < EXPIRATION_MS);

    if (history.length !== originalLength) {
        saveHistory();
        notifyRenderer();
        console.log(`Cleaned up ${originalLength - history.length} expired entries.`);
    }
}

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    win.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            win.hide();
        }
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    tray.setToolTip('Echo Paste');

    const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Show Echo Paste',
        click: () => {
            win.show();
        },
    },
    {
        label: 'Quit',
        click: () => {
            app.isQuitting = true;
            app.quit();
        },
    },
]);

tray.setContextMenu(contextMenu);

  // Left-click the tray icon toggles the window
tray.on('click', () => {
    if (win.isVisible()) {
        win.hide();
    } else {
        win.show();
    }
});
}

function startClipboardWatcher() {
    setInterval(async () => {
        const currentText = await clipboard.readText();

        if (currentText && currentText !== lastClipboardText) {
            lastClipboardText = currentText;
            addToHistory(currentText);
        }
    }, 1000);
}

// --- IPC handlers: respond to requests from index.html / React app ---

ipcMain.handle('get-history', () => {
    return history;
});

ipcMain.handle('copy-item', async (event, id) => {
    const item = history.find((h) => h.id === id);
    if (item) {
        await clipboard.writeText(item.text);
        lastClipboardText = item.text; // prevent re-capturing it as a "new" copy
    }
});

ipcMain.handle('delete-item', (event, id) => {
    history = history.filter((h) => h.id !== id);
    saveHistory();
    notifyRenderer();
});

ipcMain.handle('clear-history', () => {
    history = [];
    saveHistory();
    notifyRenderer();
});

app.whenReady().then(() => {
    loadHistory();
    cleanExpiredEntries();
    createWindow();
    createTray();
    startClipboardWatcher();

    globalShortcut.register('Control+Shift+V', () => {
        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
            win.focus();
        }
    });

    setInterval(cleanExpiredEntries, 5 * 60 * 1000); // TEMP: check every 5 seconds
});

app.on('window-all-closed', (event) => {
    event.preventDefault();
    
});

app.on('before-quit', () => {
    app.isQuitting = true;
});