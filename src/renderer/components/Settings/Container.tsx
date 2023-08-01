import { Group } from '@mantine/core';
import { useToggle } from '@mantine/hooks';

import AddSoftwareButton from '../AddSoftware/Button';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import RemoveSoftwareButton from '../RemoveSoftware/Button';
import AddShortcutButton from '../AddShortcut/Button';
import RemoveShortcutButton from '../RemoveShortcut/Button';
import SettingsMenu from './Menu';
import FactoryResetButton from './FactoryResetButton';
import SignInButton from '../Auth/SignInButton';

function SettingContainer() {
  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const [opened, toggle] = useToggle();

  return (
    <SettingsMenu toggle={toggle} opened={opened}>
      {selectedSoftwareShortcut ? (
        <Group spacing="xs">
          <AddShortcutButton />
          <RemoveShortcutButton />
        </Group>
      ) : (
        <Group spacing="xs">
          <AddSoftwareButton />
          <RemoveSoftwareButton />
          <FactoryResetButton toggle={toggle} />
          <SignInButton />
        </Group>
      )}
    </SettingsMenu>
  );
}

export default SettingContainer;
