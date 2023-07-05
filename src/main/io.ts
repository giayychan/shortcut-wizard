import path from 'path';
import {
  remove,
  outputJson,
  ensureDir,
  copy,
  readJson,
  writeJson,
} from 'fs-extra';
import { readdir } from 'fs/promises';
import { getAssetPath, getUserDataPath } from './utils';
import { shortcutValidation } from './schema';
import type {
  Shortcut,
  SoftwareShortcut,
  SoftwareShortcuts,
} from '../../@types/shortcuts';

const USER_SOFTWARE_SHORTCUTS_DIR = getUserDataPath('shortcuts');
const SYS_SOFTWARE_SHORTCUTS_DIR = getAssetPath('data', 'shortcuts');

export const initializeUserData = async () => {
  try {
    await ensureDir(USER_SOFTWARE_SHORTCUTS_DIR);
  } catch (error) {
    console.log("Couldn't ensure user shortcuts directory exists");
    throw error;
  }

  try {
    await copy(SYS_SOFTWARE_SHORTCUTS_DIR, USER_SOFTWARE_SHORTCUTS_DIR, {
      overwrite: false,
    });
  } catch (error) {
    console.log("Couldn't copy system shortcuts directory to user");
    throw error;
  }
};

export const writeCustomIconToDisk = async (
  userIconFile: string,
  uploadedCustomIconPath: string,
  errorCallback?: () => Promise<void>
) => {
  try {
    await copy(userIconFile, uploadedCustomIconPath);
  } catch (error) {
    console.log(
      `Couldn't write custom icon to ${uploadedCustomIconPath}`,
      error
    );
    if (errorCallback) await errorCallback();
    throw error;
  }
};

export const fetchSoftwareShortcuts = async () => {
  try {
    const files = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);

    const softwareShortcuts: SoftwareShortcuts = {};

    await Promise.all(
      files.map(async (file) => {
        if (path.extname(file).toLowerCase() === '.json') {
          const filePath = getUserDataPath('shortcuts', file);
          const data: SoftwareShortcut = await readJson(filePath);
          softwareShortcuts[data.software.key] = data;
        }
      })
    );

    return softwareShortcuts;
  } catch (error) {
    console.log("Couldn't read user shortcuts directory", error);
    throw error;
  }
};

export const fetchSoftwareShortcut = async (softwareKey: string) => {
  const filePath = getUserDataPath('shortcuts', `${softwareKey}.json`);

  try {
    const result: SoftwareShortcut = await readJson(filePath);
    return result;
  } catch (error: any) {
    console.log(`Couldn't read user shortcuts - ${softwareKey}.json: ${error}`);
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
  } catch (error) {
    console.log(`Couldn't add user shortcuts - ${softwareKey}.json`, error);
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
  } catch (error) {
    console.log(`Couldn't remove user shortcuts - ${softwareKey}.json`, error);
    throw error;
  }
};

export const addSoftwareShortcut = async (
  data: SoftwareShortcut,
  uploadedCustomIconPath?: string
) => {
  const { key, customIcon } = data.software;

  if (!key) throw Error('softwareKey is required');
  if (!data.shortcuts) throw Error('shortcuts is required');

  const writeDse = getUserDataPath('shortcuts', `${key}.json`);

  try {
    await outputJson(writeDse, data);
    if (uploadedCustomIconPath) {
      await writeCustomIconToDisk(customIcon, uploadedCustomIconPath, () =>
        remove(writeDse)
      );
    }
  } catch (error) {
    console.log(`Couldn't add software - ${key}.json`, error);
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
  } catch (error) {
    console.log(`Couldn't remove softwares`, error);
    throw error;
  }
};
