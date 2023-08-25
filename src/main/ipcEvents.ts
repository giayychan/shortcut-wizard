import { ipcMain } from 'electron';

import {
  addShortcutsBySoftwareKey,
  removeShortcutsBySoftwareKey,
  updateShortcutsBySoftwareKey,
} from './io';

export default function dbCalls() {
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

  // todo: test this for windows
  // Handle window controls via IPC
  // ipcMain.on('shell:open', () => {
  //   const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked');
  //   const pagePath = path.join('file://', pageDirectory, 'index.html');
  //   shell.openExternal(pagePath);
  //   console.log({ pagePath });
  // });
}
