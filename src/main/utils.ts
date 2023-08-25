/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { copy, ensureDir, readFile, remove } from 'fs-extra';
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  app,
  globalShortcut,
} from 'electron';
import Store from 'electron-store';
import { machineId } from 'node-machine-id';
import chalk from 'chalk';
import { APP_HOTKEYS, DEFAULT_HEIGHT, WIDTH } from './constants';
import mainWindow from './mainWindow';
import { IconData } from '../../@types';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const USER_PATH = app.getPath('userData');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export const getUserDataPath = (...paths: string[]): string => {
  return path.join(USER_PATH, ...paths);
};

export const { log } = console;
export const logError = (...text: unknown[]) =>
  log(chalk.bold.bgRedBright(text));
export const logSuccess = (...text: unknown[]) => log(chalk.bold.green(text));
export const logInfo = (...text: unknown[]) => log(chalk.bold.yellow(text));

export const createDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const mapKeyToReadable = (key: string) => {
  switch (key) {
    case 'Meta':
      return 'cmd';
    case ' ':
      return 'Space';
    default:
      return key;
  }
};

export const mapSystemToReadable = (system: string) => {
  switch (system) {
    case 'darwin':
      return 'macOS';
    case 'win32':
      return 'Windows';
    case 'linux':
      return 'Linux';
    default:
      return system;
  }
};

export const registerGlobalOpenAppShortcut = () =>
  globalShortcut.register(APP_HOTKEYS.join('+'), () => {
    const window = mainWindow.getWindow();

    if (!window) return;

    if (mainWindow.getIsHidden()) {
      window.show();
      mainWindow.setIsHidden(false);
    } else if (window.fullScreen) {
      window.setFullScreen(false);
      window.show();
      mainWindow.setIsHidden(false);
    } else {
      window.hide();
      mainWindow.setIsHidden(true);
    }
  });

export const getBrowserWindowType = () => {
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

export const preloadPath = app.isPackaged
  ? path.join(__dirname, 'preload.js')
  : path.join(__dirname, '../../.erb/dll/preload.js');

export const defaultWindowOptions = {
  type: getBrowserWindowType(),
  width: WIDTH,
  minWidth: WIDTH,
  height: DEFAULT_HEIGHT,
  minHeight: DEFAULT_HEIGHT,
  alwaysOnTop: true,
  movable: true,
  hasShadow: true,
  show: false,
  backgroundColor: '#141517',
  resizable: true,
  title: 'Shortcut Wizard',
  paintWhenInitiallyHidden: true,
  frame: false,
  center: true,
  icon: getAssetPath('assets/icons/icon.ico'),
  titleBarStyle: 'hidden',
  titleBarOverlay: true,
  trafficLightPosition: { x: 10, y: 10 },
  webPreferences: {
    // devTools: true,
    preload: preloadPath,
  },
} as BrowserWindowConstructorOptions;

export const setMainBrowserWindow = () => {
  mainWindow.setWindow(new BrowserWindow(defaultWindowOptions));

  const window = mainWindow.getWindow();
  if (!window) throw Error('Something went wrong when creating window');

  window.setPosition(window.getPosition()[0], 200);
  return window;
};

export const USER_SOFTWARE_SHORTCUTS_DIR = getUserDataPath('shortcuts');
export const USER_CUSTOM_ICONS_DIR = getUserDataPath('icons');
export const SYS_SOFTWARES_ICONS_DIR = getAssetPath('icons', 'softwares');
export const SYS_SOFTWARE_SHORTCUTS_DIR = getAssetPath(
  'data',
  'shortcuts',
  process.platform
);

export const USER_VECTOR_STORE_DIR = getUserDataPath('vector_store');

export const getIconFile = async (icon: IconData) => {
  const { filename, isCustom } = icon;

  const srcDir = isCustom ? USER_CUSTOM_ICONS_DIR : SYS_SOFTWARES_ICONS_DIR;
  const userIconPath = `${srcDir}/${filename}`;

  try {
    const res = await readFile(userIconPath, {
      encoding: 'utf8',
    });

    const dataUri = createDataUri(res);
    // logSuccess(`Got ${isCustom ? 'user' : 'system'} ${filename} icons `);

    return { ...icon, dataUri };
  } catch (error) {
    logError(`Couldn't get user icons - ${userIconPath}`, error);
    throw error;
  }
};

export const initializeUserData = async () => {
  const store = new Store();

  const opened = store.get('opened');
  const storeMachineId = store.get('machineId');

  if (!storeMachineId) {
    const id = await machineId();
    store.set('machineId', id);
  }

  if (!opened) {
    try {
      await remove(USER_SOFTWARE_SHORTCUTS_DIR);
      await remove(USER_CUSTOM_ICONS_DIR);
      await remove(USER_VECTOR_STORE_DIR);
    } catch (error) {
      logError("Couldn't remove user shortcuts directory");
      throw error;
    }

    try {
      await ensureDir(USER_SOFTWARE_SHORTCUTS_DIR);
      await ensureDir(USER_CUSTOM_ICONS_DIR);
      await ensureDir(USER_VECTOR_STORE_DIR);
    } catch (error) {
      logError("Couldn't ensure user shortcuts directory exists");
      throw error;
    }

    try {
      await copy(SYS_SOFTWARE_SHORTCUTS_DIR, USER_SOFTWARE_SHORTCUTS_DIR, {
        overwrite: false,
      });

      logSuccess('User data initialized');
    } catch (error) {
      logError("Couldn't copy system shortcuts directory to user");
      throw error;
    }

    store.set('opened', true);
  }
};
