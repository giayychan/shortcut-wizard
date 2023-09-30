import { modals } from '@mantine/modals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { signOut } from 'firebase/auth';
import { auth } from 'main/configs/firebase';

import { Flex, Avatar, Button, Text, Skeleton } from '@mantine/core';

import useAuthStore from '../../stores/useAuthStore';
import UpgradeButton from './UpgradeButton';

dayjs.extend(relativeTime);

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

  if (user === undefined)
    return (
      <Flex direction="column" gap="md" h="100%">
        <Text size="xl" mb={4}>
          Account Information
        </Text>
        <Flex direction="column" gap="md" className="flex-grow" align="center">
          <Skeleton height={60} circle mb="xl" />

          <Skeleton height={20} width="40%" radius="xl" />
          <Skeleton height={20} width="40%" radius="xl" />

          <Skeleton height={30} mt={6} width="30%" radius="xl" />
        </Flex>
      </Flex>
    );

  return (
    <Flex direction="column" gap="md" h="100%" w="100%">
      <Text size="xl" mb={4}>
        Account Information
      </Text>
      <Flex direction="column" gap="md" className="flex-grow" align="center">
        <Avatar src={user?.photoURL} alt="User avatar" size={60} radius="xl">
          {userInitials}
        </Avatar>

        <div className="max-w-sm text-center truncate">
          <p className="font-bold truncate">{user?.displayName || 'User'} </p>
          <p className="truncate">{user?.email || ''}</p>
        </div>
        <UpgradeButton />

        {user === undefined ? null : (
          <Button variant="light" onClick={handleSignOut} mt="xs">
            Sign Out
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

export default UserProfile;
