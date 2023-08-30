import { ReactNode, useState } from 'react';
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
  IconUser,
} from '@tabler/icons-react';

import useAuthStore from '../../stores/useAuthStore';
import trpcReact from '../../utils/trpc';
import UserAccountDetail from './UserLink';
import MainLinks from './MainLinks';

import EditSoftwareSetting from '../EditSoftware/EditSoftwareSetting';
import Feedback from './Feedback';
import GlobalSettings from './GlobalSettings';
import EditShortcutSetting from './EditShortcutSetting';

function SettingWrapper({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" w="100%" gap="xl" pt={95} px="md">
      {children}
    </Flex>
  );
}

const LINK_DATA = [
  {
    icon: <IconUser size="1rem" />,
    color: 'blue',
    label: 'Account',
    component: (
      <SettingWrapper>
        <UserAccountDetail />
      </SettingWrapper>
    ),
  },
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
    label: 'Software',
    component: <EditSoftwareSetting />,
  },
  {
    icon: <IconEditCircle size="1rem" />,
    color: 'violet',
    label: 'Shortcut',
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
      </Navbar>

      {LINK_DATA[selected]?.component}
    </Flex>
  );
}

export default SettingsModal;
