import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import { Flex, Text, Badge, Button, Group } from '@mantine/core';
import dayjs from 'dayjs';
import SignInButton from '../Auth/SignInButton';
import trpcReact from '../../utils/trpc';
import useAuthStore from '../../stores/useAuthStore';

function UserAccountDetail() {
  const dbUser = useAuthStore((state) => state.user);
  const utils = trpcReact.useContext();
  const paidUser = utils.user.getPaidUser.getData();

  const user = dbUser || paidUser;

  if (!user) return null;

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
          <Group>
            <Button
              compact
              color="green"
              component="a"
              href={`${SHORTCUT_WIZARD_HREF}/pricing`}
              target="_href"
            >
              Buy Plan
            </Button>
            <SignInButton />
          </Group>
        </>
      ) : (
        <Text>Thanks for your support! ❤️</Text>
      )}
    </Flex>
  );
}

export default UserAccountDetail;
