import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { AuthState } from '../../../@types';
import { getUserFromDB } from '../services/user';

const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    user: null,
    loading: true,
    setLoading: (isLoading) => set({ loading: isLoading }),
    setUserByPaidUser: (user) => set({ user, loading: false }),
    setUserByFirebase: async (user) => {
      if (user) {
        const dbUser = await getUserFromDB(user.uid);
        set({ user: dbUser, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    },
  }))
);

export default useAuthStore;
