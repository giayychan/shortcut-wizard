import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { db } from 'main/configs/firebase';
import { onValue, ref } from 'firebase/database';

import { AuthState } from '../../../@types';
import { notifyClientError } from '../utils';

const useAuthStore = create(
  subscribeWithSelector<AuthState>((set) => ({
    user: null,
    setUser: async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);

        onValue(
          userRef,
          (snapshot) => {
            const userSnapshot = snapshot.val();

            // todo: add plan
            console.log({ userSnapshot });
            set({
              user: {
                ...user,
              },
            });
          },
          (err) => {
            notifyClientError(err.message);
          }
        );
      } else {
        set({ user });
      }
    },
  }))
);

export default useAuthStore;
