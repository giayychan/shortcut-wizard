import { Flex, Button, Text, Skeleton } from '@mantine/core';
import dayjs from 'dayjs';
import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import useAuthStore from '../../stores/useAuthStore';

function UpgradeButton() {
  const [user] = useAuthStore((state) => [state.user]);

  if (user === undefined)
    return <Skeleton height={30} width="100%" radius="xl" />;

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
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : SHORTCUT_WIZARD_HREF
        }/pricing`}
      >
        Upgrade Now
      </Button>
    </Flex>
  ) : (
    <Button>Thanks for purchasing! ❤️</Button>
  );
}

export default UpgradeButton;
