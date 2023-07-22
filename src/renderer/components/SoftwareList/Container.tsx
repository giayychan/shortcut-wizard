import { ActionIcon, Group } from '@mantine/core';
import { IconInputSearch } from '@tabler/icons-react';

import StyledSvg from '../common/StyledSvg';
import Settings from '../Settings/Container';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import { SoftwareShortcut } from '../../../../@types';
import useFuseSearchStore from '../../stores/useFuseSearch';

function SoftwareListContainer() {
  const softwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.softwareShortcuts
  );

  const [selected, setSelect] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
    state.setSelectedSoftwareShortcut,
  ]);

  const [isSearchResultsShow, setShowSearchResults, searchTerm] =
    useFuseSearchStore((state) => [
      state.isSearchResultsShow,
      state.setShowSearchResults,
      state.searchTerm,
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
      {(isSearchResultsShow || searchTerm) && (
        <ActionIcon
          variant={isSearchResultsShow ? 'filled' : 'subtle'}
          size="lg"
          onClick={() => setShowSearchResults(!isSearchResultsShow)}
        >
          <IconInputSearch />
        </ActionIcon>
      )}
      {softwareList?.map((softwareKey) => {
        const { software } = softwareShortcuts[softwareKey];
        const { key, icon } = software;
        const { dataUri } = icon;

        const isSelected = selected?.software.key === key;

        return (
          <ActionIcon
            variant={isSelected && !isSearchResultsShow ? 'filled' : 'subtle'}
            key={key}
            title={key}
            size="lg"
            onClick={() => {
              handleSelect(isSelected, softwareShortcuts[softwareKey]);
              setShowSearchResults(
                isSearchResultsShow ? false : isSearchResultsShow
              );
            }}
          >
            {dataUri && <StyledSvg src={dataUri} />}
          </ActionIcon>
        );
      })}
      {!isSearchResultsShow && <Settings />}
    </Group>
  );
}

export default SoftwareListContainer;
