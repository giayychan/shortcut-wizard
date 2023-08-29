import {
  useMantineTheme,
  Box,
  rem,
  UnstyledButton,
  Group,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { DbUserData } from '../../../../@types';
import SignInButton from '../Auth/SignInButton';

export function UserAccountDetail({ user }: { user: DbUserData }) {
  if (!user) return null;

  return (
    <div>
      <div>Account Information</div>
      <div>
        <SignInButton />
      </div>
    </div>
  );
}

export function UserAccountLink({
  user,
  setSelected,
  selected,
}: {
  user: DbUserData;
  selected: boolean;
  setSelected: () => void;
}) {
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
      }}
    >
      <UnstyledButton
        sx={{
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colors.dark[0],
          backgroundColor: selected
            ? theme.colors.dark[6]
            : theme.colors.dark[7],
          '&:hover': {
            backgroundColor: theme.colors.dark[6],
          },
        }}
        onClick={() => setSelected()}
      >
        <Group>
          {/* todo: nice to have user profile */}
          {/* <Avatar
            src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            radius="xl"
          />
         <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              Amy Horsefighter
            </Text>
            <Text color="dimmed" size="xs">
              ahorsefighter@gmail.com
            </Text>
          </Box> */}

          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              Plan type: {user.trial?.endDate ? 'Trial Pro' : 'Paid Pro'}
            </Text>
            {user.trial?.endDate && (
              <Text color="dimmed" size="xs">
                Trial Ends:{' '}
                {dayjs.unix(user.trial.endDate).format('DD-MMM-YYYY')}
              </Text>
            )}
          </Box>

          <IconChevronRight size={rem(18)} />
        </Group>
      </UnstyledButton>
    </Box>
  );
}
