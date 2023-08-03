import { Button } from '@mantine/core';
import { onValue, ref, remove } from 'firebase/database';
import { v4 } from 'uuid';
import { notifications } from '@mantine/notifications';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { auth, db } from 'main/firebase';
import useAuthStore from '../../stores/useAuthStore';

const { ipcRenderer } = window.electron;

function SignInButton() {
  const user = useAuthStore((state) => state.user);

  const handleSignIn = async () => {
    try {
      const redirectUri = await ipcRenderer.invoke('initiateLogin', undefined);

      const uuid = v4();

      const oneTimeUuidDocRef = ref(db, `onetime-uuids/${uuid}`);

      onValue(oneTimeUuidDocRef, async (snapshot) => {
        const authToken = snapshot.val();

        if (authToken) {
          await signInWithCustomToken(auth, authToken);

          // clean up one time uuid doc ref
          await remove(oneTimeUuidDocRef);
        }

        window.open(`${redirectUri}${uuid}`, '_blank');
      });
    } catch (error: any) {
      notifications.show({
        message: `Error when signing in: ${error.message}`,
        color: 'red',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      notifications.show({
        message: `Error when signing out: ${error.message}`,
        color: 'red',
      });
    }
  };

  return user ? (
    <Button onClick={handleSignOut}>Sign out</Button>
  ) : (
    <Button onClick={handleSignIn}>Sign in</Button>
  );
}
export default SignInButton;
