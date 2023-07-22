import { Group } from '@mantine/core';

import AddSoftwareButton from '../AddSoftware/Button';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import RemoveSoftwareButton from '../RemoveSoftware/Button';
import AddShortcutButton from '../AddShortcut/Button';
import RemoveShortcutButton from '../RemoveShortcut/Button';
import SettingsMenu from './Menu';

function SettingContainer() {
  const { selectedSoftwareShortcut } = useSelectedShortcutsStore(
    (state) => state
  );

  return (
    <SettingsMenu>
      {selectedSoftwareShortcut ? (
        <Group spacing="xs">
          <AddShortcutButton />
          <RemoveShortcutButton />
        </Group>
      ) : (
        <Group spacing="xs">
          <AddSoftwareButton />
          <RemoveSoftwareButton />
        </Group>
      )}
    </SettingsMenu>
  );
}

export default SettingContainer;
