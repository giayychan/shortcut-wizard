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
import isDev from 'electron-is-dev';
import { createIPCHandler } from 'electron-trpc/main';
import { app, BrowserWindow, shell, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { getAssetPath, resolveHtmlPath } from './utils';
import { APP_HOTKEYS, DEFAULT_HEIGHT, WIDTH } from './constants';
import dbCalls from './ipcEvents';
import mainWindow from './mainWindow';
import { initializeUserData } from './io';
import { appRouter as router } from './routers/_app';

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

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('shortcut-wizard', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('shortcut-wizard');
}

// if (isDebug) {
//   require('electron-debug')();
// }

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const getType = () => {
  let type;

  if (process.platform === 'darwin') {
    type = 'panel';
  } else if (process.platform === 'win32') {
    type = 'toolbar';
  } else {
    type = 'notification';
  }

  return type;
};

const createWindow = async () => {
  if (isDebug) {
    // await installExtensions();
  }

  mainWindow.setWindow(
    new BrowserWindow({
      type: getType(),
      width: WIDTH,
      height: DEFAULT_HEIGHT,
      minHeight: DEFAULT_HEIGHT,
      alwaysOnTop: true,
      movable: true,
      hasShadow: true,
      show: true,
      backgroundColor: '#141517',
      resizable: isDev,
      center: true,
      title: 'Shortcut Wizard',
      paintWhenInitiallyHidden: false,
      frame: false,
      icon: getAssetPath('assets/icons/icon.ico'),
      titleBarStyle: 'hidden',
      titleBarOverlay: true,
      trafficLightPosition: { x: 10, y: 10 },
      webPreferences: {
        // devTools: true,
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
    })
  );

  process.stdin.resume();

  const window = mainWindow.getWindow();

  createIPCHandler({ router, windows: [window!] });

  window!.loadURL(resolveHtmlPath('index.html'));

  window!.on('ready-to-show', () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      window.minimize();
    } else {
      window.show();
      // window.webContents.openDevTools();
    }
  });

  window!.on('closed', () => {
    mainWindow.setWindow(null);
    mainWindow.setIsHidden(false);
  });

  const menuBuilder = new MenuBuilder(window!);
  menuBuilder.buildMenu();

  window!.webContents.setWindowOpenHandler((data) => {
    shell.openExternal(data.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  return window;
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

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // params: event, commandLine, workingDirectory
    const window = mainWindow.getWindow();
    // Someone tried to run a second instance, we should focus our window.
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();
    }
  });

  app.on('open-url', async (_, href) => {
    const window = mainWindow.getWindow();

    const urlObject = new URL(href);
    const { host } = urlObject;

    switch (host) {
      case 'open':
        window!.show();
        mainWindow.setIsHidden(false);

        break;
      default:
        break;
    }
  });

  app
    .whenReady()
    .then(async () => {
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

      await initializeUserData();

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
}

dbCalls();
