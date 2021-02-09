const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
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

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Setting Window Icon - Asset file needs to be in the public/images folder.
  //mainWindow.setIcon(path.join(__dirname, 'images/appicon.ico'));

  // In development mode, show dev tools asap
  if (isDev) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  }
};

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
// app.setPath(
//   'userData',
//   isDev
//     ? path.join(app.getAppPath(), 'userdata/') // In development it creates the userdata folder where package.json is
//     : path.join(process.resourcesPath, 'userdata/') // In production it creates userdata folder in the resources folder
// );

app.whenReady().then(async () => {
  await createWindow();

  // // If you want to add React Dev Tools
  // if (isDev) {
  //   await session.defaultSession
  //     .loadExtension(
  //       path.join(__dirname, `../userdata/extensions/react-dev-tools`) // This folder should have the chrome extension for React Dev Tools. Get it online or from your Chrome extensions folder.
  //     )
  //     .then((name) => console.log('Dev Tools Loaded'))
  //     .catch((err) => console.log(err));
  // }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on('uncaughtException', (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
