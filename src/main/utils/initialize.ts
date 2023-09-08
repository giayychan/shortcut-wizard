import { machineId } from 'node-machine-id';
import AutoLaunch from 'auto-launch';
import { remove, ensureDir, copy, readdir } from 'fs-extra';
import { logError, logSuccess, store } from '.';
import {
  USER_SOFTWARE_SHORTCUTS_DIR,
  USER_CUSTOM_ICONS_DIR,
  SYS_SOFTWARE_SHORTCUTS_DIR,
} from './path';

const createSortedSoftwareList = async () => {
  try {
    const filenames = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);
    const sortedList = filenames.map((filename) =>
      filename.replace('.json', '')
    );

    store.set('sortedSoftwareList', sortedList);

    return sortedList;
  } catch (error: any) {
    logError(`Couldn't software keyList: ${error}`);
    throw error;
  }
};

export const autoLaunch = async (userEnabled: boolean) => {
  try {
    // todo: need to test if this works on windows & linux
    const appAutoLauncher = new AutoLaunch({
      name: 'Shortcut Wizard',
      mac: {
        useLaunchAgent: true,
      },
    });

    if (!userEnabled) {
      await appAutoLauncher.disable();
    } else {
      await appAutoLauncher.enable();
    }

    const isEnabled = await appAutoLauncher.isEnabled();

    store.set('isAutoLaunchEnabled', isEnabled);

    return isEnabled;
  } catch (error: any) {
    logError('autoLaunch error: ', error.message);
    throw error;
  }
};

const isExecPathChanged = async () => {
  const currPath = process.execPath;
  const prev = store.get('execPath');
  if (prev !== currPath) store.set('execPath', currPath);
  return prev !== currPath;
};

const initializeAutoLaunch = async () => {
  try {
    const userEnabled = store.get('isAutoLaunchEnabled');

    const pathChanged = await isExecPathChanged();

    if ((pathChanged && userEnabled) || userEnabled === undefined) {
      await autoLaunch(true);
    }
  } catch (error: any) {
    logError('autoLaunch error: ', error.message);
    throw error;
  }
};

const initializeUserData = async () => {
  const storeMachineId = store.get('machineId');
  const processPlatform = store.get('processPlatform');

  const opened = store.get('opened');

  if (storeMachineId === undefined) {
    const id = await machineId();
    store.set('machineId', id);
  }
  if (processPlatform === undefined) {
    store.set('processPlatform', process.platform);
  }

  if (opened === undefined) {
    store.set('sortSoftwareByRecentOpened', true);
    store.delete('isPanelAlwaysAtCenter');
    store.delete('panelPosition');

    try {
      await remove(USER_SOFTWARE_SHORTCUTS_DIR);
      await remove(USER_CUSTOM_ICONS_DIR);
    } catch (error) {
      logError("Couldn't remove user shortcuts directory");
      throw error;
    }

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

      await createSortedSoftwareList();

      logSuccess('User data initialized');
    } catch (error) {
      logError("Couldn't copy system shortcuts directory to user");
      throw error;
    }

    store.set('opened', true);
  }

  await initializeAutoLaunch();
};

export default initializeUserData;
