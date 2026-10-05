const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('echoPaste', {
    getHistory: () => ipcRenderer.invoke('get-history'),
    copyItem: (id) => ipcRenderer.invoke('copy-item', id),
    deleteItem: (id) => ipcRenderer.invoke('delete-item', id),
    clearHistory: () => ipcRenderer.invoke('clear-history'),
    onHistoryUpdated: (callback) => ipcRenderer.on('history-updated', callback),
});