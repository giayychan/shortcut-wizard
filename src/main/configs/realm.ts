import Realm from 'realm';
import { BrowserWindow } from 'electron';
import { USER_REALM_DIR } from '../io';
import { logInfo } from '../utils';

let realmApp: Realm.App | null = null;

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

export const getAtlasUser = async () => {
  const user = getRealmUser();

  const userProfile = await user
    ?.mongoClient('mongodb-atlas')
    .db('shortcut-wizard')
    .collection('users')
    .findOne({ firebaseUid: user?.profile?.firebaseUid });

  return user ? userProfile : null;
};

export const updateBrowserAuth = async () => {
  // Triggering the 'authChanged' event in the main process
  const window = BrowserWindow.getFocusedWindow();

  if (window) {
    const userProfile = await getAtlasUser();
    console.log({ userProfile });
    // Sending an IPC message to the main process
    window.webContents.send(
      'authChanged',
      !userProfile ? null : JSON.stringify(userProfile)
    );
  }
};

export function onAuthChanged() {
  const user = getRealmUser();

  user?.addListener(() => {
    logInfo(`user changed auth to ${user?.id ? 'logged in' : 'logged out'}`);

    updateBrowserAuth();
  });
}

export async function signOut() {
  const user = getRealmUser();

  if (user) {
    await user?.logOut();
    user.removeAllListeners();
    updateBrowserAuth();
  }

  logInfo('User is logged out');
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

  updateBrowserAuth();

  return user;
}

export const closeRealmApp = () => {
  const user = getRealmUser();

  if (user) {
    user.removeAllListeners();
  }

  if (realmApp) {
    realmApp.removeAllListeners();
    realmApp = null;
  }
};
