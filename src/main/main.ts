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
import { createIPCHandler } from 'electron-trpc/main';
import { app, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import {
  registerGlobalOpenAppShortcut,
  setMainBrowserWindow,
  store,
} from './utils';
import mainWindow from './mainWindow';
import { appRouter as router } from './routers/_app';
import { resolveHtmlPath } from './utils/path';
import initializeUserData from './utils/initialize';

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

const createWindow = async () => {
  if (isDebug) {
    // await installExtensions();
  }

  const window = setMainBrowserWindow();

  createIPCHandler({ router, windows: [window] });
  window.loadURL(resolveHtmlPath('index.html'));

  window.on('ready-to-show', () => {
    if (process.env.START_MINIMIZED) {
      window.minimize();
    } else {
      window.show();
      // window.webContents.openDevTools();
    }
  });

  const menuBuilder = new MenuBuilder(window);
  menuBuilder.buildMenu();

  window.on('close', () => {
    const { x, y } = window.getBounds();
    const isPanelAlwaysAtCenter = store.get('isPanelAlwaysAtCenter');

    if (isPanelAlwaysAtCenter) store.delete('panelPosition');
    else store.set('panelPosition', { x, y });
  });

  window.on('closed', () => {
    mainWindow.setWindow(null);
    mainWindow.setIsHidden(false);
  });

  window.webContents.setWindowOpenHandler((data) => {
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
  const window = mainWindow.getWindow();
  if (window && !window.fullScreen) {
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
      registerGlobalOpenAppShortcut();
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

initializeUserData().catch(console.log);
