import React, { useMemo, useCallback, useRef } from 'react';
import { Flex, ScrollArea, SegmentedControl } from '@mantine/core';
import { IconInputSearch } from '@tabler/icons-react';

import StyledSvg from '../common/StyledSvg';
// import SettingsMenu from '../Settings/Container';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import { SoftwareShortcut } from '../../../../@types';
import useFuseSearchStore from '../../stores/useFuseSearch';
import SettingsButton from '../Settings/Button';

function SoftwareListContainer() {
  // const { data: softwareShortcuts } = trpcReact.software.all.useQuery();

  const softwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.softwareShortcuts
  );

  const ref = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
    state.setSelectedSoftwareShortcut,
  ]);

  const {
    isSearchResultsShow,
    setShowSearchResults,
    searchTerm,
    toggleSearchResults,
  } = useFuseSearchStore((state) => ({
    isSearchResultsShow: state.isSearchResultsShow,
    setShowSearchResults: state.setShowSearchResults,
    searchTerm: state.searchTerm,
    toggleSearchResults: state.toggleSearchResults,
  }));

  const softwareList = useMemo(
    () => Object.keys(softwareShortcuts),
    [softwareShortcuts]
  );

  const searchItem = useMemo(() => {
    return isSearchResultsShow || searchTerm
      ? [
          {
            value: 'search',
            label: <IconInputSearch />,
          },
        ]
      : [];
  }, [isSearchResultsShow, searchTerm]);

  const softwares = useMemo(() => {
    if (!softwareList?.length) return [];

    return softwareList
      .sort((a, b) => {
        const createdDateA = Date.parse(softwareShortcuts[a].createdDate);
        const createdDateB = Date.parse(softwareShortcuts[b].createdDate);
        return createdDateA - createdDateB;
      })
      .map((softwareKey) => {
        const { software } = softwareShortcuts[softwareKey];
        const { key, icon } = software;
        const { dataUri } = icon;

        return {
          value: key,
          label: dataUri ? <StyledSvg src={dataUri} /> : null,
        };
      });
  }, [softwareList, softwareShortcuts]);

  const data = useMemo(
    () => [...searchItem, ...softwares],
    [searchItem, softwares]
  );

  const handleSelect = useCallback(
    (isSelected: boolean, softwareShortcut: SoftwareShortcut) => {
      setSelected(isSelected ? null : softwareShortcut);
    },
    [setSelected]
  );

  const handleClick = useCallback(
    (e: any) => {
      const { value } = e.target;
      if (value) {
        const isSearch = value === 'search';
        if (isSearch) {
          handleSelect(false, softwareShortcuts[value]);
          toggleSearchResults();
        } else {
          setShowSearchResults(false);
          const isSelected = selected?.software.key === value;
          handleSelect(isSelected, softwareShortcuts[value]);
        }
      }
    },
    [
      toggleSearchResults,
      setShowSearchResults,
      selected,
      handleSelect,
      softwareShortcuts,
    ]
  );

  if (!data?.length) return null;

  return (
    <Flex pos="relative" direction="row" gap="lg" align="center">
      <ScrollArea type="always" scrollbarSize={6} offsetScrollbars>
        <SegmentedControl
          ref={ref}
          fullWidth
          transitionDuration={300}
          transitionTimingFunction="linear"
          onClick={handleClick}
          value={
            isSearchResultsShow && searchTerm
              ? 'search'
              : selected?.software.key || ''
          }
          data={data}
          styles={{
            control: {
              borderColor: 'transparent !important',
            },
          }}
        />
      </ScrollArea>
      <SettingsButton />
    </Flex>
  );
}

export default React.memo(SoftwareListContainer);
