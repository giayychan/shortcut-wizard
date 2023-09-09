import { useState } from 'react';
import { onValue, ref, remove } from 'firebase/database';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { Button, Flex, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { auth, db } from 'main/configs/firebase';

import useAuthStore from '../../stores/useAuthStore';
import trpcReact from '../../utils/trpc';
import { notifyClientError, notifyClientInfo } from '../../utils';

function SignInButton() {
  const utils = trpcReact.useContext();
  const paidUser = utils.user.getPaidUser.getData();
  const isDev = utils.settings.isDev.getData();
  const { mutate: openWindow } = trpcReact.settings.openWindow.useMutation();
  const user = useAuthStore((state) => state.user);

  const [signInLoading, setSignInLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [signInUnsubscribe, setSignInUnsubscribe] = useState<
    () => Promise<void>
  >(async () => {});

  const getAuthUri = trpcReact.auth.getAuthUri.useMutation();

  const handleSignIn = async () => {
    setSignInLoading(true);

    try {
      const { authUri, id } = await getAuthUri.mutateAsync();

      const oneTimeIdDocRef = ref(
        db,
        `${isDev ? 'development' : 'production'}/onetime-ids/${id}`
      );

      const unsubscribeFirebaseDocListener = onValue(
        oneTimeIdDocRef,
        async (snapshot) => {
          const authToken = snapshot.val();

          if (authToken) {
            try {
              await signInWithCustomToken(auth, authToken);
            } catch (error: any) {
              notifyClientError(`Sign in error: ${error.message}`);
            } finally {
              await remove(oneTimeIdDocRef);
              unsubscribeFirebaseDocListener();
              setSignInLoading(false);
              openWindow();
            }
          }
        },
        async (err) => {
          notifyClientError(`Error on listening onetime-ids: ${err.message}`);
          if (user) await remove(oneTimeIdDocRef);
          unsubscribeFirebaseDocListener();
          setSignInLoading(false);
        }
      );

      const unsubscribe = async () => {
        if (user) await remove(oneTimeIdDocRef);
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
    setSignInLoading(false);
    await signInUnsubscribe();
  };

  const renderSignIn = signInLoading ? (
    <Flex align="center" direction="column" justify="center" gap="xl">
      <Text align="center">
        We&apos;ve opened a new browser tab for you to sign in. <br /> Once
        you&apos;ve been authenticated you will automatically continue here.
      </Text>
      <Button onClick={handleCancelSignIn} compact>
        Cancel Sign in
      </Button>
    </Flex>
  ) : (
    <div>
      <Button
        compact
        fullWidth
        color="indigo cursor-pointer"
        onClick={handleSignIn}
      >
        Sign in
      </Button>
    </div>
  );

  if (paidUser) return null;

  return user ? (
    <div>
      <Button
        compact
        loading={signOutLoading}
        color="indigo"
        className="cursor-pointer"
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </div>
  ) : (
    renderSignIn
  );
}
export default SignInButton;
