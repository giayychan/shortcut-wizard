import Store from 'electron-store';
import { machineId } from 'node-machine-id';

import { remove, ensureDir, copy, writeJson } from 'fs-extra';
import {
  SYS_SOFTWARE_SHORTCUTS_DIR,
  USER_SOFTWARE_SHORTCUTS_DIR,
  USER_VECTOR_STORE_DIR,
  USER_CUSTOM_ICONS_DIR,
  getUserDataPath,
  logError,
  logSuccess,
} from './utils';
import { shortcutValidation } from './schema';
import type { Shortcut } from '../../@types';

const store = new Store();

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
