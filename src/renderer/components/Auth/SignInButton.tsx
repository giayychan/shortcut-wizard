import { useState } from 'react';
import { onValue, ref, remove } from 'firebase/database';
import { signInWithCustomToken } from 'firebase/auth';
import { Button, Flex, Stack, Text } from '@mantine/core';
import { auth, db } from 'main/configs/firebase';

import useAuthStore from '../../stores/useAuthStore';
import trpcReact from '../../utils/trpc';
import { notifyClientError } from '../../utils';
import LOGO from '../../../../assets/borderlesslogo.png';

function SignInButton() {
  const { mutate: openWindow } = trpcReact.settings.openWindow.useMutation();
  const user = useAuthStore((state) => state.user);

  const [signInLoading, setSignInLoading] = useState(false);
  const [signInUnsubscribe, setSignInUnsubscribe] = useState<
    () => Promise<void>
  >(async () => {});

  const getAuthUri = trpcReact.auth.getAuthUri.useMutation();

  const handleAuth = async (label: 'sign-in' | 'sign-up') => {
    setSignInLoading(true);

    try {
      const { authUri, id } = await getAuthUri.mutateAsync(label);

      const oneTimeIdDocRef = ref(db, `onetime-ids/${id}`);

      const unsubscribeFirebaseDocListener = onValue(
        oneTimeIdDocRef,
        async (snapshot) => {
          const authToken = snapshot.val();

          if (authToken) {
            try {
              await signInWithCustomToken(auth, authToken);
            } catch (error: any) {
              notifyClientError(`${label} error: ${error.message}`);
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

  const handleCancelSignIn = async () => {
    setSignInLoading(false);
    await signInUnsubscribe();
  };

  return signInLoading ? (
    <Flex align="center" direction="column" justify="center" gap="xl">
      <Text align="center">
        We&apos;ve opened a new browser tab for you to sign in. <br /> Once
        you&apos;ve been authenticated you will automatically continue here.
      </Text>
      <Button fullWidth onClick={handleCancelSignIn}>
        Cancel Sign in
      </Button>
    </Flex>
  ) : (
    <Flex direction="column" align="center" gap="xl" mb={20}>
      <img src={LOGO} alt="logo" width="80" />
      <Text align="center" size="xl" weight={800}>
        Welcome Wizard!
      </Text>
      <Stack w="100%">
        <Button fullWidth onClick={() => handleAuth('sign-in')}>
          Sign in
        </Button>
        <Button
          fullWidth
          variant="default"
          onClick={() => handleAuth('sign-up')}
        >
          Sign up
        </Button>
      </Stack>
    </Flex>
  );
}

export default SignInButton;
