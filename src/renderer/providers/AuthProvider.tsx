import dayjs from 'dayjs';
import { ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { onValue } from 'firebase/database';
import { auth } from 'main/configs/firebase';
import useAuthStore from '../stores/useAuthStore';
import TrialEndPrompt from '../components/TrialEndPrompt/Container';
import SignInPrompt from '../components/Auth/SignInPrompt';
import { getUserRef } from '../services/user';
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

  const userId = user?.uid;

  useEffect(() => {
    let unsubscribeUserChanged: () => void = () => {};

    if (userId) {
      const userRef = getUserRef(userId);
      unsubscribeUserChanged = onValue(
        userRef,
        async (snapshot) => {
          const updatedUser = snapshot.val();

          if (!updatedUser) {
            setUser(null);
            unsubscribeUserChanged();
            await signOut(auth);
          } else {
            const sanitizedData = {
              ...updatedUser,
              trial: updatedUser.trial || null,
              stripePaymentId: updatedUser.stripePaymentId || null,
            };

            setDbUser(sanitizedData);
          }
        },
        (err) => {
          notifyClientError(err.message);
          unsubscribeUserChanged();
        }
      );
    } else {
      unsubscribeUserChanged();
    }

    return () => unsubscribeUserChanged();
  }, [userId, setUser, setDbUser]);

  if (!user && connected) return <SignInPrompt />;

  const isTrialEnded =
    user?.trial?.endDate &&
    dayjs.unix(user?.trial?.endDate).toDate() < dayjs().toDate();

  if (isTrialEnded) return <TrialEndPrompt />;

  return children;
}

export default AuthProvider;
