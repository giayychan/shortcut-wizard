import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import { modals } from '@mantine/modals';
import { Flex, Text, Badge, Button, Center } from '@mantine/core';
import { auth } from 'main/configs/firebase';
import { signOut } from 'firebase/auth';
import dayjs from 'dayjs';
import useAuthStore from '../../stores/useAuthStore';
import useConnectedStore from '../../stores/useConnectedStore';

function UserAccountDetail() {
  const user = useAuthStore((state) => state.user);

  const connected = useConnectedStore((state) => state.connected);
  if (!connected) return <Center>Not connected to internet</Center>;
  if (!user) return <Center>Please sign in</Center>;

  const handleSignOut = async () => {
    await signOut(auth);
    modals.closeAll();
  };
  return (
    <Flex direction="column" gap="md">
      <Text>
        Plan type:{' '}
        <Badge variant="filled">
          {user.trial?.endDate ? 'Trial Pro' : 'Paid Pro'}
        </Badge>
      </Text>

      <Text>Email: {user.email}</Text>

      {user.trial?.endDate ? (
        <>
          <Text>
            Trial Ends: {dayjs.unix(user.trial.endDate).format('DD-MMM-YYYY')}
          </Text>
          <Button
            compact
            color="green"
            component="a"
            href={`${SHORTCUT_WIZARD_HREF}/pricing`}
            target="_href"
          >
            Buy Plan
          </Button>
        </>
      ) : (
        <Text>Thank you for your support! ❤️</Text>
      )}

      <Button
        compact
        color="indigo"
        className="cursor-pointer"
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </Flex>
  );
}

export default UserAccountDetail;
