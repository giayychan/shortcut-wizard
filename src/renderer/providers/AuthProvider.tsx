import dayjs from 'dayjs';
import { ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { onChildChanged } from 'firebase/database';
import { auth } from 'main/configs/firebase';
import useAuthStore from '../stores/useAuthStore';
import TrialEndPrompt from '../components/TrialEndPrompt/Container';
import SignInPrompt from '../components/Auth/SignInPrompt';
import trpcReact from '../utils/trpc';
import { getUserFromDB, getUserRef } from '../services/user';
import { notifyClientError } from '../utils';

function AuthProvider({ children }: { children: ReactNode }) {
  const { data: paidUser, isLoading } = trpcReact.user.getPaidUser.useQuery();

  const { mutate } = trpcReact.user.updatePaidUser.useMutation();

  const [user, setUserByFirebase, setUserByPaidUser, loading] = useAuthStore(
    (state) => [
      state.user,
      state.setUserByFirebase,
      state.setUserByPaidUser,
      state.loading,
    ]
  );

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (!isLoading) {
      if (!paidUser) {
        unsubscribe = onAuthStateChanged(auth, setUserByFirebase);
      } else {
        setUserByPaidUser(paidUser);
      }
    }

    return () => unsubscribe();
  }, [paidUser, setUserByFirebase, isLoading, setUserByPaidUser]);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    let unsubscribeUserChanged: () => void = () => {};
    if (userId) {
      const userRef = getUserRef(userId);

      unsubscribeUserChanged = onChildChanged(
        userRef,
        async () => {
          const updatedUser = await getUserFromDB(userId);

          if (!updatedUser) {
            setUserByFirebase(null);
            unsubscribeUserChanged();
            await signOut(auth);
          } else {
            setUserByPaidUser(updatedUser);
          }
        },
        (err) => {
          notifyClientError(err.message);
          unsubscribeUserChanged();
        }
      );
    }

    return () => unsubscribeUserChanged();
  }, [userId, setUserByFirebase, setUserByPaidUser]);

  const shouldUpdatePaidUser =
    !isLoading && !paidUser?.stripePaymentId && user?.stripePaymentId;

  useEffect(() => {
    if (shouldUpdatePaidUser) {
      mutate(user);
    }
  }, [mutate, user, shouldUpdatePaidUser]);

  if (loading || isLoading || paidUser) return children;

  if (!user) return <SignInPrompt />;

  const isTrialEnded =
    user?.trial?.endDate &&
    dayjs.unix(user?.trial?.endDate).toDate() < dayjs().toDate();

  if (isTrialEnded) return <TrialEndPrompt />;

  return children;
}

export default AuthProvider;
