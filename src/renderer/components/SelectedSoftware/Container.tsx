import { Text } from '@mantine/core';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';

function SelectedSoftware() {
  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  if (!selectedSoftwareShortcut) return null;

  return (
    <Text weight={700} pl={5} pr={10} className="capitalize">
      {selectedSoftwareShortcut.software.key}
    </Text>
  );
}

export default SelectedSoftware;
