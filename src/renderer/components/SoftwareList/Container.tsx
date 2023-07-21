import { ActionIcon, Group } from '@mantine/core';

import StyledSvg from '../common/StyledSvg';
import Settings from '../Settings/Container';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import { SoftwareShortcut } from '../../../../@types';

function SoftwareListContainer() {
  const [softwareShortcuts] = useSoftwareShortcutsStore((state) => [
    state.softwareShortcuts,
  ]);

  const [selected, setSelect] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
    state.setSelectedSoftwareShortcut,
  ]);

  const softwareList = Object.keys(softwareShortcuts);

  const handleSelect = (
    isSelected: boolean,
    softwareShortcut: SoftwareShortcut
  ) => {
    if (isSelected) {
      setSelect(null);
    } else {
      setSelect(softwareShortcut);
    }
  };

  return (
    <Group pos="relative" h="2.25rem">
      {softwareList?.map((softwareKey) => {
        const { software } = softwareShortcuts[softwareKey];
        const { key, icon } = software;
        const { dataUri } = icon;

        const isSelected = selected?.software.key === key;

        return (
          <ActionIcon
            variant={isSelected ? 'filled' : 'subtle'}
            key={key}
            title={key}
            size="lg"
            onClick={() =>
              handleSelect(isSelected, softwareShortcuts[softwareKey])
            }
          >
            {dataUri && <StyledSvg src={dataUri} />}
          </ActionIcon>
        );
      })}

      <Settings />
    </Group>
  );
}

export default SoftwareListContainer;
