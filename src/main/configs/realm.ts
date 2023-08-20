import Realm from 'realm';
import { BrowserWindow } from 'electron';
import { USER_REALM_DIR } from '../io';
import { logInfo } from '../utils';

let realmApp: Realm.App | null = null;

export const updateBrowserAuth = (userProfile: string | null) => {
  // Triggering the 'authChanged' event in the main process
  const window = BrowserWindow.getFocusedWindow();

  if (window) {
    // Sending an IPC message to the main process
    window.webContents.send('authChanged', userProfile);
  }
};

export function getRealmApp() {
  if (!realmApp) {
    throw Error('Realm app is not initialized');
  }

  return realmApp;
}

export function getRealmUser() {
  if (realmApp?.currentUser) {
    return realmApp.currentUser;
  }
  return null;
}

export function onAuthChanged() {
  const user = getRealmUser();

  user?.addListener(() => {
    logInfo(`user changed auth to ${user?.id ? 'logged in' : 'logged out'}`);

    const userProfile = JSON.stringify(user?.profile) || null;

    updateBrowserAuth(userProfile);
  });
}

export async function initializeRealmApp() {
  realmApp = new Realm.App({
    id: 'shortcut-wizard-iagls',
    baseFilePath: USER_REALM_DIR,
    app: {
      name: 'Shortcut Wizard',
      version: '1', // bundle id
    },
  });

  const user = getRealmUser();

  logInfo(user ? 'User is logged in' : 'User is not logged in');

  onAuthChanged();
}

export async function signInByToken(token: string) {
  const app = getRealmApp();

  const credentials = Realm.Credentials.jwt(token);
  const user = await app.logIn(credentials);

  logInfo('User logged in with id token');

  onAuthChanged();

  const userProfile = JSON.stringify(user?.profile) || null;
  updateBrowserAuth(userProfile);

  return user;
}

export async function signOut() {
  const user = getRealmUser();

  if (user) {
    await user?.logOut();
    user.removeAllListeners();
    updateBrowserAuth(null);
  }

  logInfo('User is logged out');
}
