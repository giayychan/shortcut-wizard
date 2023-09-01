import path from 'path';
import { app } from 'electron';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

const USER_PATH = app.getPath('userData');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export const getUserDataPath = (...paths: string[]): string => {
  return path.join(USER_PATH, ...paths);
};

export const USER_SOFTWARE_SHORTCUTS_DIR = getUserDataPath('shortcuts');

export const USER_VECTOR_STORE_DIR = getUserDataPath('vector_store');

export const USER_CUSTOM_ICONS_DIR = getUserDataPath('icons');

export const SYS_SOFTWARES_ICONS_DIR = getAssetPath('icons', 'softwares');
export const SYS_SOFTWARE_SHORTCUTS_DIR = getAssetPath(
  'data',
  'shortcuts',
  process.platform
);

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  // electron-react-boilerplate/release/build/mac-arm64/ElectronReact.app/Contents/Resources/app.asar/dist/renderer/index.html
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const preloadPath = app.isPackaged
  ? path.join(__dirname, 'preload.js')
  : path.join(__dirname, '../../../.erb/dll/preload.js');
