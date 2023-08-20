import { ipcMain } from 'electron';
import isDev from 'electron-is-dev';

import {
  fetchSoftwareShortcut,
  fetchSoftwareShortcuts,
  addShortcutsBySoftwareKey,
  addSoftwareShortcut,
  removeShortcutsBySoftwareKey,
  removeSoftwareShortcut,
  fetchSoftwareAutoCompleteOptions,
  updateShortcutsBySoftwareKey,
  factoryReset,
} from './io';
import { getRealmUser, signInByToken } from './configs/realm';

export default function dbCalls() {
  ipcMain.handle('fetchSoftwareShortcuts', fetchSoftwareShortcuts);
  ipcMain.handle(
    'fetchSoftwareAutoCompleteOptions',
    fetchSoftwareAutoCompleteOptions
  );

  ipcMain.handle('fetchSoftwareShortcut', (_, [softwareKey]) =>
    fetchSoftwareShortcut(softwareKey)
  );

  ipcMain.handle('addShortcutsBySoftwareKey', (_, [softwareKey, shortcuts]) =>
    addShortcutsBySoftwareKey(softwareKey, shortcuts)
  );

  ipcMain.handle(
    'updateShortcutsBySoftwareKey',
    (_, [softwareKey, updatedShortcuts]) =>
      updateShortcutsBySoftwareKey(softwareKey, updatedShortcuts)
  );

  ipcMain.handle(
    'removeShortcutsBySoftwareKey',
    (_, [softwareKey, shortcuts]) =>
      removeShortcutsBySoftwareKey(softwareKey, shortcuts)
  );

  ipcMain.handle('addSoftwareShortcut', (_, [data]) =>
    addSoftwareShortcut(data)
  );

  ipcMain.handle('removeSoftwareShortcut', (_, [softwareList]) =>
    removeSoftwareShortcut(softwareList)
  );

  ipcMain.handle('factoryReset', factoryReset);

  // // Handle window controls via IPC
  // ipcMain.on('shell:open', () => {
  //   const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked');
  //   const pagePath = path.join('file://', pageDirectory, 'index.html');
  //   shell.openExternal(pagePath);
  //   console.log({ pagePath });
  // });

  ipcMain.on('authChanged', async (event) => {
    // for dev only since electron deep link is not working during development mode. copy the authToken from the browser console and paste it here to login
    if (isDev) {
      const authToken = '';
      if (authToken) await signInByToken(authToken);
    }

    const user = getRealmUser();

    if (user) {
      event.reply('authChanged', JSON.stringify(user?.profile));
    } else {
      event.reply('authChanged', null);
    }
  });
}
