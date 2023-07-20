/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app } from 'electron';
import chalk from 'chalk';

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
