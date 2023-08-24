import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { onChildChanged } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { auth } from 'main/configs/firebase';

import { AuthState } from '../../../@types';
import { notifyClientError } from '../utils';
import { getUserFromDB, getUserRef } from '../services/user';

const defaultAuthState = {
  user: null,
  unsubscribeUserChanged: () => {},
};

const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    ...defaultAuthState,
    loading: true,
    setLoading: (isLoading) => set({ loading: isLoading }),
    setUser: async (user) => {
      if (user) {
        const dbUser = await getUserFromDB(user.uid);
        set({ user: dbUser, loading: false });

        const userRef = getUserRef(user.uid);

        const unsubscribeUserChanged = onChildChanged(
          userRef,
          async () => {
            const updatedUser = await getUserFromDB(user.uid);

            if (!updatedUser) {
              set({ ...defaultAuthState });
              unsubscribeUserChanged();
              await signOut(auth);
            } else {
              set({ user: updatedUser });
            }
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

        set({ ...defaultAuthState, loading: false });
      }
    },
  }))
);

export default useAuthStore;
