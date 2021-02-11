const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs').promises;

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(
        app.getAppPath(),
        `./${isDev ? 'public' : 'build'}/preload.js`
      ),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
  });

  // Load from localhost if in development
  // Otherwise load index.html file
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open DevTools if in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// Create a new browser window by invoking the createWindow
// function once the Electron application is initialized.
// Install REACT_DEVELOPER_TOOLS as well if isDev
app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }

  createWindow();
});

// Add a new listener that tries to quit the application when
// it no longer has any open windows. This listener is a no-op
// on macOS due to the operating system's window management behavior.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Add a new listener that creates a new browser window only if
// when the application has no visible windows after being activated.
// For example, after launching the application for the first time,
// or re-launching the already running application.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// The code above has been adapted from a starter example in the Electron docs:
// https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file

// -----------------------------------------------------------------
// Below: application specific implementation code.
// Obviously this could (or should!) be relocated to separate files.
//

const openExistingFile = (fp) => {
  app.addRecentDocument(fp);
  return fs.readFile(fp, 'utf8').then((data) => ({
    path: fp,
    viewName: path.basename(fp),
    data,
  }));
};

const openFile = (path) =>
  path
    ? openExistingFile(path)
    : dialog
        .showOpenDialog(BrowserWindow.getFocusedWindow(), {
          title: 'Open Markdown Document',
          properties: ['openFile'],
          filters: [
            { name: 'Markdown Documents', extensions: ['md'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        })
        .then(({ filePaths }) => filePaths.length > 0 && filePaths[0])
        .then((path) => path && openExistingFile(path));

app.on('open-file', (event, path) => {
  event.preventDefault();

  return openExistingFile(path).then((res) =>
    BrowserWindow.getFocusedWindow().webContents.send('external-open-file', res)
  );
});

ipcMain.handle('dummy-button', () => {
  return dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'info',
    buttons: ['Oh well then'],
    title: 'No features here, sorry!',
    message:
      'Unfortunately this is just a demo and the functionality you tried to use is not available.',
  });
});

// We don't need 'event' or 'args' here, but
// they are easy to receive with the ipc call.
ipcMain.handle('open-file', (event, args) => openFile());
