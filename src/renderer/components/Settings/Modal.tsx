import { ReactNode, useEffect, useState } from 'react';
import {
  Navbar,
  ScrollArea,
  Flex,
  Divider,
  UnstyledButton,
  Text,
  Group,
} from '@mantine/core';
import { ContextModalProps, modals } from '@mantine/modals';
import {
  IconWorld,
  IconDatabaseEdit,
  IconEditCircle,
  IconMessages,
  IconArrowBackUp,
} from '@tabler/icons-react';
import { MAX_HEIGHT } from 'main/constants';

import useAuthStore from '../../stores/useAuthStore';
import trpcReact from '../../utils/trpc';
import { UserAccountDetail, UserAccountLink } from './UserLink';
import MainLinks from './MainLinks';

import EditSoftwareSetting from '../EditSoftware/EditSoftwareSetting';
import Feedback from './Feedback';
import GlobalSettings from './GlobalSettings';
import EditShortcutSetting from './EditShortcutSetting';
import useAppHeightStore from '../../stores/useAppHeightStore';

function SettingWrapper({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" w="100%" gap="xl" pt={95} px="md">
      {children}
    </Flex>
  );
}

const LINK_DATA = [
  {
    icon: <IconWorld size="1rem" />,
    color: 'blue',
    label: 'System Settings',
    component: (
      <SettingWrapper>
        <GlobalSettings />
      </SettingWrapper>
    ),
  },
  {
    icon: <IconDatabaseEdit size="1rem" />,
    color: 'teal',
    label: 'Edit Software',
    component: <EditSoftwareSetting />,
  },
  {
    icon: <IconEditCircle size="1rem" />,
    color: 'violet',
    label: 'Edit Shortcut',
    component: <EditShortcutSetting />,
  },
  {
    icon: <IconMessages size="1rem" />,
    color: 'grape',
    label: 'Feedback',
    component: (
      <SettingWrapper>
        <Feedback />
      </SettingWrapper>
    ),
  },
];

function SettingsModal({
  innerProps: { selectedSettingsTab },
}: ContextModalProps<{
  selectedSettingsTab: number;
}>) {
  const [selected, setSelected] = useState(selectedSettingsTab);
  const { mutate } = trpcReact.appHeight.update.useMutation();
  const height = useAppHeightStore((state) => state.height);

  useEffect(() => {
    mutate({ height: MAX_HEIGHT });
    return () => mutate({ height });
  }, [mutate, height]);

  const dbUser = useAuthStore((state) => state.user);
  const utils = trpcReact.useContext();
  const paidUser = utils.user.getPaidUser.getData();

  const user = dbUser || paidUser;

  if (!user) return null;

  return (
    <Flex>
      <Navbar width={{ base: 300 }} pt={30} pb={15} pl={10}>
        <Navbar.Section grow component={ScrollArea} pr="xs">
          <UnstyledButton
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
            })}
            onClick={() => modals.closeAll()}
          >
            <Group>
              <IconArrowBackUp />
              <Text size="sm">Back</Text>
            </Group>
          </UnstyledButton>
          <Divider mb="md" />
          <MainLinks
            data={LINK_DATA}
            setSelected={setSelected}
            selected={selected}
          />
        </Navbar.Section>
        <Navbar.Section pr="xs">
          <Divider mt="md" />
          <UserAccountLink
            user={user}
            selected={selected === LINK_DATA.length + 1}
            setSelected={() => {
              setSelected(LINK_DATA.length + 1);
            }}
          />
        </Navbar.Section>
      </Navbar>

      {LINK_DATA[selected]?.component || (
        <SettingWrapper>
          <UserAccountDetail user={user} />
        </SettingWrapper>
      )}
    </Flex>
  );
}

export default SettingsModal;
