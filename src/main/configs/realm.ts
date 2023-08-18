import Realm from 'realm';
import { USER_REALM_DIR } from '../io';
import { logInfo } from '../utils';

let realmApp: Realm.App | null = null;

export function getRealmApp() {
  if (!realmApp) {
    throw Error('Realm app is not initialized');
  }

  return realmApp;
}

export function initializeRealmApp() {
  realmApp = new Realm.App({
    id: 'shortcut-wizard-iagls',
    baseFilePath: USER_REALM_DIR,
    app: {
      name: 'Shortcut Wizard',
      version: '1', // bundle id
    },
  });

  logInfo(
    realmApp.currentUser?.id ? 'User is logged in' : 'User is not logged in'
  );
}

export async function signInRealm(token: string) {
  const app = getRealmApp();

  const credentials = Realm.Credentials.jwt(token);
  const user = await app.logIn(credentials);

  logInfo('User logged in with id token');

  return user;
}

export async function signOut() {
  const app = getRealmApp();

  await app.currentUser?.logOut();
  logInfo('User is logged out');
}
