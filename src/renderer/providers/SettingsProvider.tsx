import { notifications } from '@mantine/notifications';
import { Kbd, Text, Stack } from '@mantine/core';
import { ReactNode, useEffect } from 'react';
import trpcReact from '../utils/trpc';

function SettingsProvider({ children }: { children: ReactNode }) {
  trpcReact.settings.processPlatform.useQuery();
  const { data: isClosedTutorial, isFetched } =
    trpcReact.settings.isClosedTutorial.useQuery();

  const { mutate } = trpcReact.settings.updateIsClosedTutorial.useMutation();

  useEffect(() => {
    if (!isClosedTutorial && isFetched) {
      notifications.show({
        id: 'tutorial',
        title: (
          <Stack spacing="md">
            <Text h={25}>
              Tip: Use <Kbd>shift</Kbd> + <Kbd>space</Kbd> to show and hide the
              app quickly
            </Text>
            <Text
              h={25}
              size="xs"
              underline
              className="cursor-pointer"
              onClick={() => {
                mutate(true);
                notifications.hide('tutorial');
              }}
            >
              Never show again
            </Text>
          </Stack>
        ),
        message: '',
        autoClose: false,
      });
    }
  }, [isClosedTutorial, isFetched, mutate]);

  return children;
}

export default SettingsProvider;
