import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'main/configs/firebase';
import useAuthStore from '../stores/useAuthStore';

function useUser() {
  const [user, setUser] = useAuthStore((state) => [state.user, state.setUser]);

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, [setUser]);

  return user;
}

export default useUser;
