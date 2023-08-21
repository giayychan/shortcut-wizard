import { create } from 'zustand';

import { ConnectedState } from '../../../@types';

const useConnectedStore = create<ConnectedState>((set) => ({
  connected: false,
  setConnected: (connected) => {
    set({ connected });
  },
}));

export default useConnectedStore;
