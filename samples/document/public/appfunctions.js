const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Load content from a file we assume exists (i.e. we
// know its path)
const openExistingFile = (fp) => {
  app.addRecentDocument(fp);
  return fs.readFile(fp, 'utf8').then((data) => ({
    path: fp,
    viewName: path.basename(fp),
    data,
  }));
};

// Open and load a file after asking the user for its
// location first, or return nothing if no choice is made
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

// Handle the app level open-file event, which may be generated
// by the OS for instance when loading a recent document
app.on('open-file', (event, path) => {
  event.preventDefault();

  return openExistingFile(path).then((res) =>
    BrowserWindow.getFocusedWindow().webContents.send('external-open-file', res)
  );
});

// Tell the user that we have no idea what we should do
ipcMain.handle('dummy-button', () => {
  return dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: 'info',
    buttons: ['Oh well then'],
    title: 'No features here, sorry!',
    message:
      'Unfortunately this is just a demo and the functionality you tried to use is not available.',
  });
});

// This is the open-file api method published to the
// Renderer, called from client code when the toolbar "Open"
// button is used.
// We don't need 'event' or 'args' here, but
// they are easy to receive with the ipc call.
ipcMain.handle('open-file', (event, args) => openFile());

// Run through 20 steps for the application- (or window-) wide
// progress bar. Deactivate the menu item while we do this.
// Mac and Windows should show this progress on the Dock
// and taskbar, in Linux it depends on the Window manager.
const startProgressCycle = () => {
  let progVal = 0;
  const step = 0.05;
  let intervalId;

  const menuItem = Menu.getApplicationMenu().getMenuItemById(
    'progressCycleMenu'
  );
  menuItem.enabled = false;

  const browserWindow = BrowserWindow.getFocusedWindow();

  const interval = () => {
    if (progVal >= 1.0) {
      clearInterval(intervalId);
      browserWindow.setProgressBar(-1);
      menuItem.enabled = true;
    } else {
      progVal += step;
      browserWindow.setProgressBar(progVal);
    }
  };

  intervalId = setInterval(interval, 600);
};

module.exports = { openFile, openExistingFile, startProgressCycle };
