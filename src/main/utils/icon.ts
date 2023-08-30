import { readFile, copy } from 'fs-extra';
import { logSuccess, logError } from '.';
import { IconData } from '../../../@types';
import { USER_CUSTOM_ICONS_DIR, SYS_SOFTWARES_ICONS_DIR } from './path';

const createDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const getIconFile = async (icon: IconData) => {
  const { filename, isCustom } = icon;

  const srcDir = isCustom ? USER_CUSTOM_ICONS_DIR : SYS_SOFTWARES_ICONS_DIR;
  const userIconPath = `${srcDir}/${filename}`;

  try {
    const res = await readFile(userIconPath, {
      encoding: 'utf8',
    });

    const dataUri = createDataUri(res);
    logSuccess(`Got ${isCustom ? 'user' : 'system'} ${filename} icons `);

    return { ...icon, dataUri };
  } catch (error) {
    logError(`Couldn't get user icons - ${userIconPath}`, error);
    throw error;
  }
};

export const writeCustomIconToDisk = async (
  src: string,
  desc: string,
  errorCallback?: () => Promise<void>
) => {
  try {
    await copy(src, desc);
    logSuccess(`Copied custom icon to ${desc}`);
  } catch (error: any) {
    logError(`Couldn't write custom icon to ${desc} - ${error.message}`);
    if (errorCallback) await errorCallback();
    throw error;
  }
};
