import { signOut } from 'firebase/auth';
import { get as getRef, ref } from 'firebase/database';
import { auth, db } from 'main/configs/firebase';
import { notifyClientError } from 'renderer/utils';
import { DbUserData } from '../../../@types';

export const getUserRef = (userUid: string) => ref(db, `users/${userUid}`);

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
