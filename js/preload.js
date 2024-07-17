const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onRequestTextToSave: (callback) => ipcRenderer.on('request-text-to-save', (event, filePath) => {
    callback(event, filePath);
  }),
  saveTextToFile: (text, filePath) => ipcRenderer.send('save-text-to-file', text, filePath),
  onCopyText: (callback) => ipcRenderer.on('copy-text', callback),
  onLoadTextFromFile: (callback) => ipcRenderer.on('load-text-from-file', (event, text) => {
    callback(text);
  }),
});
