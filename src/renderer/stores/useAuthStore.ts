import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { AuthState } from '../../../@types';
import { getUserFromDB } from '../services/user';
import { notifyClientError } from '../utils';

const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    user: undefined,
    loading: true,
    setLoading: (loading) => set({ loading }),
    setUser: async (user) => {
      if (user) {
        const dbUser = await getUserFromDB(user.uid);

        try {
          if (!dbUser) throw new Error('User not found in DB');
          set({ user: { ...user, ...dbUser } });
        } catch (error: any) {
          notifyClientError(`Retrieving user error from DB: ${error.message}`);
        }
      } else {
        set({ user: null });
      }
    },
    setDbUser: async (dbUser) => {
      if (!dbUser) set({ user: null });
      else {
        const originalUser = get().user;
        if (!originalUser) set({ user: null });
        else set({ user: { ...originalUser, ...dbUser } });
      }
    },
  }))
);

export default useAuthStore;
