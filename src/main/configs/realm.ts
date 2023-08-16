import Realm from 'realm';
import { USER_REALM_DIR } from '../io';

// Define the schema for the user authentication collection
const UserSchema = {
  name: 'User',
  properties: {
    userId: 'string',
    jwtToken: 'string',
    createdAt: 'date',
  },
  primaryKey: 'userId', // Set the primary key to 'userId'
};

export async function loginRealm() {
  const realmApp = new Realm.App({
    id: 'shortcut-wizard-iagls',
    baseFilePath: USER_REALM_DIR,
  });

  const credentials = Realm.Credentials.anonymous();

  const user = await realmApp.logIn(credentials);
  console.log({ USERID: user.id });
  return user;
}

export async function storeUserAuthInfo(userId: string, jwtToken: string) {
  const realm = await Realm.open({ schema: [UserSchema] });
  realm.write(() => {
    realm.create('ElectronUser', { userId, jwtToken, createdAt: new Date() });
  });
  realm.close();
}
