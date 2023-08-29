import { Flex, Text, Badge } from '@mantine/core';
import dayjs from 'dayjs';
import SignInButton from '../Auth/SignInButton';
import trpcReact from '../../utils/trpc';
import useAuthStore from '../../stores/useAuthStore';
import TrialEndPromptContainer from '../TrialEndPrompt/Container';

function UserAccountDetail() {
  const dbUser = useAuthStore((state) => state.user);
  const utils = trpcReact.useContext();
  const paidUser = utils.user.getPaidUser.getData();

  const user = dbUser || paidUser;

  if (!user) return null;

  return (
    <Flex direction="column" gap="md">
      <SignInButton />

      <Text>
        Plan type:{' '}
        <Badge variant="filled">
          {user.trial?.endDate ? 'Trial Pro' : 'Paid Pro'}
        </Badge>
      </Text>

      {user.trial?.endDate ? (
        <>
          <Text>
            Trial Ends: {dayjs.unix(user.trial.endDate).format('DD-MMM-YYYY')}
          </Text>
          <TrialEndPromptContainer />
        </>
      ) : (
        <Text>Thanks for your support! ❤️</Text>
      )}
    </Flex>
  );
}

export default UserAccountDetail;
