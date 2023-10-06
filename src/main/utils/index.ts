import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  globalShortcut,
} from 'electron';
import chalk from 'chalk';
import Store from 'electron-store';
import { APP_HOTKEYS, DEFAULT_HEIGHT, WIDTH } from '../constants';
import mainWindow from '../mainWindow';

import { getAssetPath, preloadPath } from './path';

export const store = new Store();

const { log } = console;
export const logError = (...text: unknown[]) =>
  log(chalk.bold.bgRedBright(text));

export const logSuccess = (...text: unknown[]) => log(chalk.bold.green(text));

export const logInfo = (...text: unknown[]) => log(chalk.bold.yellow(text));

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

const getPanelPosition = () => {
  const isPanelAlwaysAtCenter = store.get('isPanelAlwaysAtCenter') as
    | boolean
    | undefined;

  const panelPosition = store.get('panelPosition') as
    | { x: number; y: number }
    | undefined;

  if (isPanelAlwaysAtCenter) return { center: true };

  if (panelPosition?.x && panelPosition?.y)
    return { ...panelPosition, center: false };

  return { center: true };
};

const defaultWindowOptions = {
  ...(process.platform === 'darwin' ? { type: 'panel' } : undefined),
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
  icon: getAssetPath('assets/icons/icon.ico'),
  titleBarStyle: 'hidden',
  titleBarOverlay: {
    color: '#1A1B1E',
    symbolColor: '#dddddd',
  },
  trafficLightPosition: { x: 10, y: 10 },
  webPreferences: {
    // devTools: true,
    preload: preloadPath,
  },
  ...getPanelPosition(),
} as BrowserWindowConstructorOptions;

export const setMainBrowserWindow = () => {
  mainWindow.setWindow(new BrowserWindow(defaultWindowOptions));

  const window = mainWindow.getWindow();
  if (!window) throw Error('Something went wrong when creating window');

  return window;
};
