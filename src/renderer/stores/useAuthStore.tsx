import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AuthState } from '../../../@types';

const useAuthStore = create(
  subscribeWithSelector<AuthState>((set) => ({
    user: null,
    setUser: (user) => {
      set({ user });
    },
  }))
);

export default useAuthStore;
