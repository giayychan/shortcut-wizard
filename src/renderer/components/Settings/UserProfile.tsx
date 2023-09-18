import { modals } from '@mantine/modals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import { signOut } from 'firebase/auth';
import { auth } from 'main/configs/firebase';

import { Flex, Avatar, Button, Text } from '@mantine/core';

import useAuthStore from '../../stores/useAuthStore';
import trpcReact from '../../utils/trpc';

dayjs.extend(relativeTime);

export function UpgradeButton() {
  const [user, loading] = useAuthStore((state) => [state.user, state.loading]);

  const utils = trpcReact.useContext();
  const isDev = utils.settings.isDev.getData();

  if (loading) return null;

  return user?.trial.endDate ? (
    <Flex direction="column" gap={5} align="center">
      <Text size="sm" weight={700}>
        Trial ends {dayjs().to(dayjs.unix(user.trial.endDate))}
      </Text>
      <Button
        fullWidth
        component="a"
        gradient={{ from: 'red', to: 'purple', deg: 145 }}
        target="_blank"
        variant="gradient"
        href={`${
          isDev ? 'http://localhost:3000' : SHORTCUT_WIZARD_HREF
        }/pricing`}
      >
        Upgrade Now
      </Button>
    </Flex>
  ) : (
    <Button>Thanks for purchasing! ❤️</Button>
  );
}

function UserProfile() {
  const user = useAuthStore((state) => state.user);

  const handleSignOut = async () => {
    await signOut(auth);
    modals.closeAll();
  };

  const userInitials =
    user?.displayName
      ?.split(' ')
      .map((n) => n[0].toUpperCase())
      .join('') || '';

  return (
    <Flex direction="column" gap="md" h="100%">
      <Text size="xl" mb={4}>
        Account Information
      </Text>
      <Flex direction="column" gap="md" className="flex-grow">
        <Flex align="center" gap="xs">
          <Avatar src={user?.photoURL} alt="User avatar" size="md" radius="xl">
            {userInitials}
          </Avatar>
          <div className="truncate">
            <p className="font-bold">{user?.displayName || 'User'} </p>
            <p className="text-sm truncate">{user?.email}</p>
          </div>
        </Flex>
        <UpgradeButton />
        <Button variant="light" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Flex>
    </Flex>
  );
}

export default UserProfile;
