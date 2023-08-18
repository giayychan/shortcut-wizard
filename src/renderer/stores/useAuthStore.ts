import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { notifications } from '@mantine/notifications';
import { AuthState } from '../../../@types';

const useAuthStore = create(
  subscribeWithSelector<AuthState>((set) => ({
    user: null,
    setUser: async (user) => {
      set({ user });
      if (user)
        notifications.show({
          message: `Logged in successfully`,
          color: 'blue',
        });
    },
  }))
);

export default useAuthStore;
