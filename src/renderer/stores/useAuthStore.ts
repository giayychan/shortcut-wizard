import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { auth, db } from 'main/configs/firebase';
import {
  onChildChanged,
  ref,
  get as getRef,
  DatabaseReference,
} from 'firebase/database';
import { signOut } from 'firebase/auth';

import { AuthState, DbUserData } from '../../../@types';
import { notifyClientError } from '../utils';
import useGlobalLoadingStore from './useGlobalLoadingStore';

const { loading, setLoading } = useGlobalLoadingStore.getState();

const getUserFromDB = async (userRef: DatabaseReference) => {
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

const useAuthStore = create(
  subscribeWithSelector<AuthState>((set, get) => ({
    user: null,
    unsubscribeUserChanged: () => {},
    setUser: async (user) => {
      if (loading) {
        setLoading(false);
      }

      if (user) {
        const userRef = ref(db, `users/${user.uid}`);

        const dbUser = await getUserFromDB(userRef);
        set({ user: dbUser });

        const unsubscribeUserChanged = onChildChanged(
          userRef,
          async () => {
            const updatedUser = await getUserFromDB(userRef);
            set({ user: updatedUser });
          },
          (err) => {
            notifyClientError(err.message);
            unsubscribeUserChanged();
          }
        );

        set({ unsubscribeUserChanged });
      } else {
        const { unsubscribeUserChanged } = get();
        unsubscribeUserChanged();
        set({ unsubscribeUserChanged: () => {}, user: null });
      }
    },
  }))
);

export default useAuthStore;
