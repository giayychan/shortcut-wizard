import { ipcMain, shell } from 'electron';
import path from 'path';
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

  // Handle window controls via IPC
  ipcMain.on('shell:open', () => {
    const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked');
    const pagePath = path.join('file://', pageDirectory, 'index.html');
    shell.openExternal(pagePath);
    console.log({ pagePath });
  });
}
