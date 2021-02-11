const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openFile: () => ipcRenderer.invoke('open-file'),
  dummyButton: () => ipcRenderer.invoke('dummy-button'),
});
