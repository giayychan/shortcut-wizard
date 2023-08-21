import { ref, onValue } from 'firebase/database';
import { db } from 'main/configs/firebase';
import { useEffect } from 'react';
import useConnectedStore from '../stores/useConnectedStore';
import { notifyClientError } from '../utils';

// handle offline/online status
function useConnected() {
  const connected = useConnectedStore((state) => [
    state.connected,
    state.setConnected,
  ]);

  const connectedRef = ref(db, '.info/connected');

  useEffect(() => {
    const unsubscribe = onValue(connectedRef, (snap) => {
      const clientConnected = snap.val();
      // if (!clientConnected) notifyClientError('Looks like you are offline');
    });

    return () => unsubscribe();
  }, [connectedRef]);

  return connected;
}

export default useConnected;
