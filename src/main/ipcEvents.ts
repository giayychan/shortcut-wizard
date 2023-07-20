import { ipcMain } from 'electron';
import { WIDTH } from './constants';
import appWindow from './mainWindow';
import {
  fetchSoftwareShortcut,
  fetchSoftwareShortcuts,
  addShortcutsBySoftwareKey,
  addSoftwareShortcut,
  removeShortcutsBySoftwareKey,
  removeSoftwareShortcut,
  fetchSoftwareAutoCompleteOptions,
} from './io';

export default function dbCalls() {
  ipcMain.on('updateMainWindowHeight', (_, [height]) => {
    const mainWindow = appWindow.getWindow();
    if (mainWindow) mainWindow.setSize(WIDTH, height);
  });

  ipcMain.handle('fetchSoftwareShortcuts', () => fetchSoftwareShortcuts());
  ipcMain.handle('fetchSoftwareAutoCompleteOptions', () =>
    fetchSoftwareAutoCompleteOptions()
  );

  ipcMain.handle('fetchSoftwareShortcut', (_, [softwareKey]) =>
    fetchSoftwareShortcut(softwareKey)
  );

  ipcMain.handle('addShortcutsBySoftwareKey', (_, [softwareKey, shortcuts]) =>
    addShortcutsBySoftwareKey(softwareKey, shortcuts)
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
}
