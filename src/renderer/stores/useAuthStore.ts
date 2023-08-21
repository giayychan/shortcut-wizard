import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { db } from 'main/configs/firebase';
import { onValue, ref } from 'firebase/database';

import { AuthState } from '../../../@types';
import { notifyClientError } from '../utils';
import useGlobalLoadingStore from './useGlobalLoadingStore';

const { loading, setLoading } = useGlobalLoadingStore.getState();

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
                // plan_type: userSnapshot.plan_type,
                // plan_interval: userSnapshot.plan_interval,
                // stripe_id: userSnapshot.stripe_id,
              },
            });

            if (loading) {
              setLoading(false);
            }
          },
          (err) => {
            notifyClientError(err.message);
          }
        );
      } else {
        set({ user });
        if (loading) {
          setLoading(false);
        }
      }
    },
  }))
);

export default useAuthStore;
