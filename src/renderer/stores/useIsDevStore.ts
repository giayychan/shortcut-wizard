import { create } from 'zustand';

import { IsDevState } from '../../../@types';

const useIsDevStore = create<IsDevState>((set) => ({
  isDev: false,
  setIsDev: (isDev) => {
    set({ isDev });
  },
}));

export default useIsDevStore;
