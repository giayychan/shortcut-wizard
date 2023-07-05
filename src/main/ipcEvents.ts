import { ipcMain } from 'electron';
import { BASE_HEIGHT, WIDTH } from './constants';
import appWindow from './mainWindow';
import {
  fetchSoftwareShortcut,
  fetchSoftwareShortcuts,
  addShortcutsBySoftwareKey,
  addSoftwareShortcut,
  removeShortcutsBySoftwareKey,
  removeSoftwareShortcut,
} from './io';

export default function dbCalls() {
  ipcMain.on('setWindowHeight', (_, [height = BASE_HEIGHT]) => {
    const mainWindow = appWindow.getWindow();
    if (mainWindow) mainWindow.setSize(WIDTH, height);
  });

  ipcMain.handle('fetchSoftwareShortcuts', () => fetchSoftwareShortcuts());

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

  ipcMain.handle('addSoftwareShortcut', (_, [data, uploadedCustomIconPath]) =>
    addSoftwareShortcut(data, uploadedCustomIconPath)
  );

  ipcMain.handle('removeSoftwareShortcut', (_, [softwareList]) =>
    removeSoftwareShortcut(softwareList)
  );
}
