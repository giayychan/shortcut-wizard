import Realm from 'realm';
import isDev from 'electron-is-dev';
import path from 'path';
import { getUserDataPath } from '../utils';

const app = new Realm.App({ id: 'shortcut-wizard-iagls' }); // create a new instance of the Realm.App

async function runRealm() {
  // login with an anonymous credential

  const credentials = Realm.Credentials.anonymous();
  const user = await app.logIn(credentials);

  const DogSchema = {
    name: 'Dog',
    properties: {
      _id: 'int',
      name: 'string',
      age: 'int',
    },
    primaryKey: '_id',
  };

  const realmPath = isDev
    ? './.realm/default.realm'
    : path.join(getUserDataPath(), 'default.realm');

  const realm = await Realm.open({
    schema: [DogSchema],
    path: realmPath,
    // sync: {
    //   user,
    //   // partitionValue: 'myPartition',
    // },
  });

  // console.log(realm.schema);

  // // The myPartition realm is now synced to the device. You can
  // // access it through the `realm` object returned by `Realm.open()`

  // // write to the realm
  // const dogs = realm.objects('Dog');
  // console.log(`Main: Number of Dog objects: ${dogs.length}`);

  // realm.write(() => {
  //   realm.create('Dog', {
  //     _id: 2,
  //     name: 'Fido',
  //     age: 5,
  //   });
  // });
}

export default runRealm;
