import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import useAuthStore from '../../stores/useAuthStore';
import trpcReact from '../../utils/trpc';

function SignInButton() {
  const user = useAuthStore((state) => state.user);

  const getAuthUri = trpcReact.auth.getAuthUri.useMutation();
  const signOut = trpcReact.auth.signOut.useMutation();

  const handleSignIn = async () => {
    try {
      const { authUri } = await getAuthUri.mutateAsync();

      window.open(authUri, '_blank');
    } catch (error: any) {
      notifications.show({
        message: `Error when signing in: ${error.message}`,
        color: 'red',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error: any) {
      notifications.show({
        message: `Error when signing out: ${error.message}`,
        color: 'red',
      });
    }
  };

  return user ? (
    <Button color="pink cursor-pointer" onClick={handleSignOut}>
      Sign out
    </Button>
  ) : (
    <Button fullWidth color="indigo cursor-pointer" onClick={handleSignIn}>
      Sign in
    </Button>
  );
}
export default SignInButton;
