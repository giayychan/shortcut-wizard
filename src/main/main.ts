/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/prefer-default-export */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';

import { app, BrowserWindow, shell, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { getAssetPath, resolveHtmlPath } from './utils';
import { APP_HOTKEYS, WIDTH } from './constants';
import dbCalls from './ipcEvents';
import mainWindow from './mainWindow';
import { initializeUserData } from './io';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDebug) {
//   require('electron-debug')();
// }

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    // await installExtensions();
  }

  mainWindow.setWindow(
    new BrowserWindow({
      // type: 'panel',
      show: false,
      width: WIDTH,
      height: 0,
      resizable: process.env.NODE_ENV !== 'production',
      hasShadow: true,
      transparent: true,
      frame: false,
      icon: getAssetPath('assets/icons/png/64x64.png'),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
    })
  );

  const window = mainWindow.getWindow();

  window!.loadURL(resolveHtmlPath('index.html'));

  window!.on('ready-to-show', () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      window.minimize();
    } else {
      window.show();
    }
  });

  window!.on('closed', () => {
    mainWindow.setWindow(null);
    mainWindow.setIsHidden(false);
  });

  const menuBuilder = new MenuBuilder(window!);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  window!.webContents.setWindowOpenHandler((data) => {
    shell.openExternal(data.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
// to minimize the window when the user clicks outside of the app
app.on('browser-window-blur', () => {
  // && process.env.NODE_ENV === 'production'
  const window = mainWindow.getWindow();
  if (window) {
    window.hide();
    mainWindow.setIsHidden(true);
  }
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
    mainWindow.setIsHidden(false);
  }
});

app
  .whenReady()
  .then(async () => {
    await initializeUserData();

    globalShortcut.register(APP_HOTKEYS.join('+'), () => {
      const window = mainWindow.getWindow();
      if (window) {
        if (mainWindow.getIsHidden()) {
          window.show();
          mainWindow.setIsHidden(false);
        } else {
          window.hide();
          mainWindow.setIsHidden(true);
        }
      }
    });

    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      const window = mainWindow.getWindow();
      if (window === null) {
        createWindow();
      } else {
        mainWindow.setIsHidden(false);
        window.show();
      }
    });
  })
  .catch(console.log);

dbCalls();
