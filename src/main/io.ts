import path from 'path';
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
  // logInfo,
  logSuccess,
} from './utils';
import { shortcutValidation } from './schema';
import type {
  IconData,
  Shortcut,
  SoftwareShortcut,
  SoftwareShortcuts,
  AddSoftwareAutocompleteOption,
} from '../../@types';
import { AUTO_COMPLETE_CUSTOM_OPTION } from './constants';

export const USER_SOFTWARE_SHORTCUTS_DIR = getUserDataPath('shortcuts');
export const USER_CUSTOM_ICONS_DIR = getUserDataPath('icons');
export const SYS_SOFTWARE_SHORTCUTS_DIR = getAssetPath('data', 'shortcuts');
export const SYS_SOFTWARES_ICONS_DIR = getAssetPath('icons', 'softwares');

export const initializeUserData = async () => {
  try {
    await ensureDir(USER_SOFTWARE_SHORTCUTS_DIR);
    await ensureDir(USER_CUSTOM_ICONS_DIR);
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
    logSuccess(`Got ${isCustom ? 'user' : 'system'} ${filename} icons `);

    return { ...icon, dataUri };
  } catch (error) {
    logError(`Couldn't get user icons - ${userIconPath}`, error);
    throw error;
  }
};

export const createAutoCompleteOptions = async (desc: string) => {
  try {
    const filenames = await readdir(desc);

    const autoCompleteOptions: AddSoftwareAutocompleteOption[] =
      await Promise.all(
        filenames.map(async (filename) => {
          const [key] = filename.split('.');

          const icon = await getIconFile({
            isCustom: false,
            filename,
          });

          return {
            software: {
              key,
              icon,
            },
            shortcuts: [],
            value: key,
          };
        })
      );

    autoCompleteOptions.push(AUTO_COMPLETE_CUSTOM_OPTION);

    const json = JSON.stringify(autoCompleteOptions);
    const writeDse = getAssetPath('data', 'autocomplete-options.json');

    await writeJson(writeDse, json);
    logSuccess(`Created autocomplete options`);
  } catch (error) {
    logError(`Couldn't create autocomplete options`, error);
    throw error;
  }
};

export const fetchSoftwareAutoCompleteOptions = async () => {
  const filePath = getAssetPath('data', 'autocomplete-options.json');

  try {
    const result = await readJson(filePath);
    logSuccess(`fetched software shortcut - ${filePath} successfully`);
    return JSON.parse(result);
  } catch (error: any) {
    logError(`Couldn't read user shortcuts - ${filePath}: ${error}`);
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

          const icon = await getIconFile(data.software.icon);
          data.software.icon = icon;
          softwareShortcuts[data.software.key] = data;
        }
      })
    );
    logSuccess('fetched software shortcuts successfully');
    return softwareShortcuts;
  } catch (error) {
    logError("Couldn't read user shortcuts directory", error);
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
    logError(`Couldn't read user shortcuts - ${softwareKey}.json: ${error}`);
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
  } catch (error) {
    logError(`Couldn't add user shortcuts - ${softwareKey}.json`, error);
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
  } catch (error) {
    logError(`Couldn't remove user shortcuts - ${softwareKey}.json`, error);
    throw error;
  }
};

export const addSoftwareShortcut = async (data: SoftwareShortcut) => {
  const { key, icon } = data.software;

  if (!key) throw Error('softwareKey is required');
  if (!data.shortcuts) throw Error('shortcuts is required');

  const writeDse = getUserDataPath('shortcuts', `${key}.json`);

  const localIconPath = icon.filename;

  icon.filename = path.basename(icon.filename);

  try {
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
