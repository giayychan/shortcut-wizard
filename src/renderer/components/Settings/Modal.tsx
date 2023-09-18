import { useEffect, useState } from 'react';

import { Flex, Grid, NavLink } from '@mantine/core';
import { ContextModalProps, modals } from '@mantine/modals';
import {
  IconChevronRight,
  IconSettings,
  IconComponents,
  IconKeyboard,
  IconHeartFilled,
  IconArrowBackUp,
  IconUser,
} from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';

import Feedback from './Feedback';
import GlobalSettings from './GlobalSettings';
import SortSoftwareList from './SortSoftwareList';
import TitleBar from '../../layout/TitleBar';

import UserProfile from './UserProfile';
import EditSoftwareSetting from '../EditSoftware/EditSoftwareSetting';
import EditShortcutSetting from './EditShortcutSetting';
import { TabType } from '../../../../@types';
import AddSoftwareSetting from '../EditSoftware/AddSoftwareSetting';
import UpgradeButton from './UpgradeButton';

function SettingsModal({
  innerProps: { selectedSettingsTab },
}: ContextModalProps<{
  selectedSettingsTab: TabType;
}>) {
  const [selected, setSelected] = useState(selectedSettingsTab || 'Account');

  const [searchParams] = useSearchParams();
  const modalTab = searchParams.get('modalTab');

  useEffect(() => {
    if (modalTab) {
      setSelected(modalTab as TabType);
      searchParams.delete('modalTab');
    }
  }, [modalTab, searchParams]);

  const renderSelectedTab = () => {
    switch (selected) {
      case 'Account':
        return { component: <UserProfile /> };
      case 'System Setting':
        return { component: <GlobalSettings /> };
      case 'Add Software':
        return { component: <AddSoftwareSetting /> };
      case 'Edit Software':
        return {
          component: <EditSoftwareSetting setSelected={setSelected} />,
        };
      case 'Sort Software':
        return { component: <SortSoftwareList /> };
      case 'Add Shortcut':
        return {
          component: <EditShortcutSetting type="Add" />,
        };
      case 'Edit Shortcut':
        return {
          component: (
            <EditShortcutSetting setSelectedTab={setSelected} type="Edit" />
          ),
        };
      case 'Feedback':
        return { component: <Feedback /> };
      default:
        return { component: <div /> };
    }
  };

  const { component } = renderSelectedTab();

  return (
    <>
      <TitleBar />
      <Grid px="sm" py="sm" m={0} h="calc(100vh - 35px)">
        <Grid.Col span={4} p={0} pr={10}>
          <Flex
            direction="column"
            h="100%"
            className="p-4 border border-[#373A40] rounded-lg"
          >
            <Flex direction="column" gap={5} className="flex-grow">
              <NavLink
                label="Back"
                className="rounded-lg"
                icon={<IconArrowBackUp size="1rem" stroke={1.5} />}
                onClick={() => modals.closeAll()}
              />
              <NavLink
                active={selected === 'Account'}
                label="Account"
                className="rounded-lg"
                icon={<IconUser size="1rem" stroke={1.5} />}
                rightSection={<IconChevronRight size="1rem" stroke={1.5} />}
                onClick={() => setSelected('Account')}
              />
              <NavLink
                active={selected === 'System Setting'}
                label="System Setting"
                className="rounded-lg"
                icon={<IconSettings size="1rem" stroke={1.5} />}
                rightSection={<IconChevronRight size="1rem" stroke={1.5} />}
                onClick={() => setSelected('System Setting')}
              />

              <NavLink
                active={selected.includes('Software')}
                label="Software"
                childrenOffset={28}
                icon={<IconComponents size="1rem" stroke={1.5} />}
                className="rounded-lg"
              >
                <NavLink
                  active={selected === 'Add Software'}
                  className="mb-1 rounded-lg"
                  label="Add"
                  onClick={() => setSelected('Add Software')}
                />
                <NavLink
                  active={selected === 'Edit Software'}
                  className="mb-1 rounded-lg"
                  label="Edit / Delete"
                  onClick={() => setSelected('Edit Software')}
                />
                <NavLink
                  active={selected === 'Sort Software'}
                  className="rounded-lg"
                  label="Sort"
                  onClick={() => setSelected('Sort Software')}
                />
              </NavLink>
              <NavLink
                active={selected.includes('Shortcut')}
                label="Shortcut"
                childrenOffset={28}
                icon={<IconKeyboard size="1rem" stroke={1.5} />}
                className="rounded-lg"
              >
                <NavLink
                  active={selected === 'Add Shortcut'}
                  className="mb-1 rounded-lg"
                  label="Add"
                  onClick={() => setSelected('Add Shortcut')}
                />
                <NavLink
                  active={selected === 'Edit Shortcut'}
                  className="rounded-lg"
                  label="Edit / Delete"
                  onClick={() => setSelected('Edit Shortcut')}
                />
              </NavLink>
              <NavLink
                active={selected === 'Feedback'}
                label="Feedback"
                className="rounded-lg"
                icon={<IconHeartFilled size="1rem" stroke={1.5} />}
                rightSection={<IconChevronRight size="1rem" stroke={1.5} />}
                onClick={() => setSelected('Feedback')}
              />
            </Flex>
            <UpgradeButton />
          </Flex>
        </Grid.Col>
        <Grid.Col span={8} p={0} h="100%" className="overflow-hidden">
          <Flex
            direction="column"
            h="100%"
            className="flex-grow border border-[#373A40] rounded-lg py-3 px-4"
          >
            {component}
          </Flex>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default SettingsModal;
