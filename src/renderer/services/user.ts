import { signOut } from 'firebase/auth';
import { get as getRef, ref } from 'firebase/database';
import { auth, db } from 'main/configs/firebase';
import { notifyClientError } from 'renderer/utils';
import { DbUserData } from '../../../@types';
import useIsDevStore from '../stores/useIsDevStore';

export const getUserRef = (userUid: string) => {
  const { isDev } = useIsDevStore.getState();

  return ref(db, `${isDev ? 'development' : 'production'}/users/${userUid}`);
};

export const getUserFromDB = async (userUid: string) => {
  const userRef = getUserRef(userUid);
  const userData = await getRef(userRef);

  try {
    if (!userData.exists()) {
      await signOut(auth);
      throw new Error('User not found in DB');
    }

    return userData.val() as DbUserData;
  } catch (error: any) {
    notifyClientError(`Retrieving user error from DB: ${error.message}`);
    return null;
  }
};
