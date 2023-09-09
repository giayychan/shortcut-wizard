import dayjs from 'dayjs';
import { ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { onChildChanged } from 'firebase/database';
import { auth } from 'main/configs/firebase';
import useAuthStore from '../stores/useAuthStore';
import TrialEndPrompt from '../components/TrialEndPrompt/Container';
import SignInPrompt from '../components/Auth/SignInPrompt';
import { getUserFromDB, getUserRef } from '../services/user';
import { notifyClientError } from '../utils';
import useConnectedStore from '../stores/useConnectedStore';

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, setDbUser] = useAuthStore((state) => [
    state.user,
    state.setUser,
    state.setDbUser,
  ]);

  const [connected] = useConnectedStore((state) => [state.connected]);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    unsubscribe = onAuthStateChanged(auth, setUser);

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    let unsubscribeUserChanged: () => void = () => {};

    if (user && user.uid) {
      const userRef = getUserRef(user.uid);

      unsubscribeUserChanged = onChildChanged(
        userRef,
        async () => {
          const updatedUser = await getUserFromDB(user.uid);

          if (!updatedUser) {
            setUser(null);
            unsubscribeUserChanged();
            await signOut(auth);
          } else {
            setDbUser(updatedUser);
          }
        },
        (err) => {
          notifyClientError(err.message);
          unsubscribeUserChanged();
        }
      );
    }

    return () => unsubscribeUserChanged();
  }, [user, setUser, setDbUser]);

  if (!user && connected) return <SignInPrompt />;

  const isTrialEnded =
    user?.trial?.endDate &&
    dayjs.unix(user?.trial?.endDate).toDate() < dayjs().toDate();

  if (isTrialEnded) return <TrialEndPrompt />;

  return children;
}

export default AuthProvider;
