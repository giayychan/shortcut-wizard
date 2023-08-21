import { useState } from 'react';
import { v4 } from 'uuid';
import { onValue, ref, remove } from 'firebase/database';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { Button, Flex, Loader, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { auth, db } from 'main/configs/firebase';

import useAuthStore from '../../stores/useAuthStore';
import trpcReact from '../../utils/trpc';
import { notifyClientError, notifyClientInfo } from '../../utils';

function SignInButton() {
  const user = useAuthStore((state) => state.user);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [signInUnsubscribe, setSignInUnsubscribe] =
    useState<() => Promise<void>>();

  const getAuthUri = trpcReact.auth.getAuthUri.useMutation();

  const handleSignIn = async () => {
    setSignInLoading(true);

    try {
      const uuid = v4();
      const { authUri } = await getAuthUri.mutateAsync({ uuid });

      const oneTimeUuidDocRef = ref(db, `onetime-uuids/${uuid}`);

      const unsubscribeFirebaseDocListener = onValue(
        oneTimeUuidDocRef,
        async (snapshot) => {
          const authToken = snapshot.val();

          if (authToken) {
            try {
              await signInWithCustomToken(auth, authToken);
            } catch (error: any) {
              notifyClientError(`Sign in error: ${error.message}`);
            } finally {
              await remove(oneTimeUuidDocRef);
              unsubscribeFirebaseDocListener();
              setSignInLoading(false);
            }
          }
        },
        async (err) => {
          console.log('error on listening onetime-uuids ', err);
          await remove(oneTimeUuidDocRef);
          unsubscribeFirebaseDocListener();
          setSignInLoading(false);
        }
      );

      const unsubscribe = async () => {
        await remove(oneTimeUuidDocRef);
        unsubscribeFirebaseDocListener();
        setSignInLoading(false);
      };

      setSignInUnsubscribe(() => unsubscribe);

      window.open(authUri, '_blank');
    } catch (error: any) {
      notifyClientError(error.message);
      setSignInLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      await signOut(auth);
      modals.closeAll();
      notifyClientInfo(`Signed out successfully`);
    } catch (error: any) {
      notifyClientError(error.message);
    } finally {
      setSignOutLoading(false);
    }
  };

  const handleCancelSignIn = async () => {
    if (!signInUnsubscribe) {
      setSignInLoading(false);
      return;
    }
    await signInUnsubscribe();
  };

  const renderSignIn = signInLoading ? (
    <Flex align="center" direction="column" gap="xl">
      <Loader />
      <Text>Redirecting you to sign in...</Text>
      <Button onClick={handleCancelSignIn}>Cancel Sign in</Button>
    </Flex>
  ) : (
    <Button fullWidth color="indigo cursor-pointer" onClick={handleSignIn}>
      Sign in
    </Button>
  );

  return user ? (
    <Button
      loading={signOutLoading}
      color="pink cursor-pointer"
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  ) : (
    renderSignIn
  );
}
export default SignInButton;
