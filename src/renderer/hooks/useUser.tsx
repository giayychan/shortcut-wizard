import { useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';

const { ipcRenderer } = window.electron;

function useUser() {
  const [user, setUser] = useAuthStore((state) => [state.user, state.setUser]);

  useEffect(() => {
    ipcRenderer.on('authChanged', (arg) => {
      if (arg && typeof arg === 'string') {
        setUser(JSON.parse(arg));
      } else {
        setUser(null);
      }
    });

    ipcRenderer.sendMessage('authChanged');
  }, [setUser]);

  return user;
}

export default useUser;
