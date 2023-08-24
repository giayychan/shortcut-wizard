import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { ref, onValue } from 'firebase/database';
import { db } from 'main/configs/firebase';
import { ConnectedState } from '../../../@types';
import { notifyClientError } from '../utils';

const useConnectedStore = create(
  subscribeWithSelector<ConnectedState>((set) => ({
    loading: true,
    connected: false,
    onConnected: () => {
      const connectedRef = ref(db, '.info/connected');

      onValue(
        connectedRef,
        (snap) => {
          const clientConnected = snap.val();
          set({ connected: clientConnected, loading: false });
        },
        (err) => {
          notifyClientError(err.message);
          set({ connected: false, loading: false });
        }
      );
    },
  }))
);

export default useConnectedStore;
