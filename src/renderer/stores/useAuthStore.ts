import { db } from 'main/configs/firebase';
import { onValue, ref } from 'firebase/database';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AuthState } from '../../../@types';

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

            set({
              user: {
                ...user,
                plan_type: userSnapshot.plan_type,
                plan_interval: userSnapshot.plan_interval,
                stripe_id: userSnapshot.stripe_id,
              },
            });
          },
          (err) => {
            console.log({ err });
          }
        );
      } else {
        set({ user });
      }
    },
  }))
);

export default useAuthStore;
