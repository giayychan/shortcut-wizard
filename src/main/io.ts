import path from 'path';
import Store from 'electron-store';
import { machineId } from 'node-machine-id';

import {
  remove,
  outputJson,
  ensureDir,
  copy,
  readJson,
  readFile,
  writeJson,
} from 'fs-extra';
import { readdir } from 'fs/promises';
import {
  createDataUri,
  getAssetPath,
  getUserDataPath,
  logError,
  logSuccess,
} from './utils';
import { shortcutValidation } from './schema';
import type { IconData, Shortcut, SoftwareShortcut } from '../../@types';

const store = new Store();

export const USER_SOFTWARE_SHORTCUTS_DIR = getUserDataPath('shortcuts');
export const USER_CUSTOM_ICONS_DIR = getUserDataPath('icons');
export const USER_VECTOR_STORE_DIR = getUserDataPath('vector_store');
export const SYS_SOFTWARE_SHORTCUTS_DIR = getAssetPath(
  'data',
  'shortcuts',
  process.platform
);

export const USER_REALM_DIR = getUserDataPath('realm');

export const SYS_SOFTWARES_ICONS_DIR = getAssetPath('icons', 'softwares');

export const initializeUserData = async () => {
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

export const fetchSoftwareShortcut = async (softwareKey: string) => {
  const filePath = getUserDataPath('shortcuts', `${softwareKey}.json`);

  try {
    const result: SoftwareShortcut = await readJson(filePath);
    const iconWithDataUri = await getIconFile(result.software.icon);
    result.software.icon = iconWithDataUri;

    logSuccess(`fetched software shortcut - ${softwareKey}.json successfully`);

    return result;
  } catch (error: any) {
    logError(`Couldn't fetchSoftwareShortcut - ${softwareKey}.json: ${error}`);
    throw error;
  }
};

export const addShortcutsBySoftwareKey = async (
  softwareKey: string,
  shortcuts: Shortcut[]
) => {
  if (!softwareKey) throw Error('softwareKey is required');
  if (!shortcuts) throw Error('shortcuts is required');

  try {
    const softwareShortcut = await fetchSoftwareShortcut(softwareKey);
    softwareShortcut.shortcuts = [...softwareShortcut.shortcuts, ...shortcuts];

    const writeDse = getUserDataPath('shortcuts', `${softwareKey}.json`);

    await shortcutValidation(softwareShortcut);

    await writeJson(writeDse, softwareShortcut);
    logSuccess(`Added user shortcuts - ${softwareKey}.json`);

    return softwareShortcut;
  } catch (error) {
    logError(`Couldn't add user shortcuts - ${softwareKey}.json`, error);
    throw error;
  }
};

export const updateShortcutsBySoftwareKey = async (
  softwareKey: string,
  updatedShortcut: Shortcut[]
) => {
  if (!softwareKey) throw Error('softwareKey is required');
  if (!updatedShortcut.length) throw Error('shortcuts is required');

  try {
    const softwareShortcut = await fetchSoftwareShortcut(softwareKey);
    softwareShortcut.shortcuts = updatedShortcut;

    const writeDse = getUserDataPath('shortcuts', `${softwareKey}.json`);

    await shortcutValidation(softwareShortcut);

    await writeJson(writeDse, softwareShortcut);
    logSuccess(`Update user shortcuts - ${softwareKey}.json`);

    return softwareShortcut;
  } catch (error) {
    logError(`Couldn't update user shortcuts - ${softwareKey}.json`, error);
    throw error;
  }
};

export const removeShortcutsBySoftwareKey = async (
  softwareKey: string,
  shortcuts: Shortcut[]
) => {
  if (!softwareKey) throw Error('softwareKey is required');
  if (!shortcuts) throw Error('shortcuts is required');

  try {
    const softwareShortcut = await fetchSoftwareShortcut(softwareKey);
    softwareShortcut.shortcuts = softwareShortcut.shortcuts.filter(
      (shortcut) => {
        const found = shortcuts.find((s) => s.id === shortcut.id);
        return !found;
      }
    );

    const writeDse = getUserDataPath('shortcuts', `${softwareKey}.json`);

    await writeJson(writeDse, softwareShortcut);
    logSuccess(`Removed user shortcuts - ${softwareKey}.json`);

    return softwareShortcut;
  } catch (error) {
    logError(`Couldn't remove user shortcuts - ${softwareKey}.json`, error);
    throw error;
  }
};

export const addSoftwareShortcut = async (data: SoftwareShortcut) => {
  const { icon, key } = data.software;

  if (!key) throw Error('softwareKey is required');

  if (!data.shortcuts) throw Error('shortcuts is required');

  const writeDse = getUserDataPath('shortcuts', `${key}.json`);

  const localIconPath = icon.filename;

  icon.filename = path.basename(icon.filename);

  try {
    const existingSoftwares = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);

    const found = existingSoftwares.some((software) => {
      const [softwareKey] = software.split('.');
      return softwareKey.toLowerCase() === key.toLowerCase();
    });

    if (found) throw Error('software already exists');

    await outputJson(writeDse, data);
    if (icon.isCustom) {
      const desc = getUserDataPath('icons', icon.filename);
      await writeCustomIconToDisk(localIconPath, desc, () => remove(writeDse));
    }
    logSuccess(`Added software - ${key}.json`);
    const iconWithDataUri = await getIconFile(icon);
    data.software.icon = iconWithDataUri;

    return data;
  } catch (error) {
    logError(`Couldn't add software - ${key}.json`, error);
    throw error;
  }
};

export const removeSoftwareShortcut = async (softwareList: string[]) => {
  if (!softwareList.length) throw Error('software list is required');

  try {
    const promises = softwareList.map(async (software) => {
      const removePath = getUserDataPath('shortcuts', `${software}.json`);
      await remove(removePath);
    });

    await Promise.all(promises);
    logSuccess(`Removed softwares - ${softwareList.join(', ')}`);
  } catch (error) {
    logError(`Couldn't remove softwares`, error);
    throw error;
  }
};
