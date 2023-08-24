import dayjs from 'dayjs';
import { ReactNode, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'main/configs/firebase';
import useAuthStore from '../stores/useAuthStore';
import TrialEndPrompt from '../components/TrialEndPrompt/Container';
import SignInPrompt from '../components/Auth/SignInPrompt';
import useConnectedStore from '../stores/useConnectedStore';

function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, user, setUser] = useAuthStore((state) => [
    state.loading,
    state.user,
    state.setUser,
  ]);

  const [connected, onConnected] = useConnectedStore((state) => [
    state.connected,
    state.onConnected,
  ]);

  useEffect(() => {
    onConnected();
    onAuthStateChanged(auth, setUser);
  }, [setUser, onConnected]);

  if (loading || !connected) return children;

  if (!user) return <SignInPrompt />;

  const isTrialEnded =
    user?.trial?.endDate &&
    dayjs(user?.trial?.endDate).toDate() < dayjs().toDate();

  if (isTrialEnded) return <TrialEndPrompt />;

  return children;
}

export default AuthProvider;
