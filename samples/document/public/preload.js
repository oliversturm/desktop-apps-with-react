const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openFile: () => ipcRenderer.invoke('open-file'),
  dummyButton: () => ipcRenderer.invoke('dummy-button'),

  onExternalOpenFile: (handler) => {
    ipcRenderer.on('external-open-file', (event, path) => handler(path));
  },
});
