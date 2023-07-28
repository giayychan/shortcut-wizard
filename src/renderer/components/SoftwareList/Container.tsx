import { Flex, ScrollArea, SegmentedControl } from '@mantine/core';
import { IconInputSearch } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

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

  const searchItem =
    isSearchResultsShow || searchTerm
      ? [
          {
            value: 'search',
            label: <IconInputSearch />,
          },
        ]
      : [];

  const softwares = softwareList.length
    ? softwareList.map((softwareKey) => {
        const { software } = softwareShortcuts[softwareKey];
        const { key, icon } = software;
        const { dataUri } = icon;

        return {
          value: key,
          label: dataUri && <StyledSvg src={dataUri} />,
        };
      })
    : [];

  const data = [...searchItem, ...softwares];

  const handleClick = (e: any) => {
    const { value } = e.target;
    if (value) {
      const isSearch = value === 'search';
      if (isSearch) setShowSearchResults(!isSearchResultsShow);

      const isSelected = selected?.software.key === value;
      handleSelect(isSelected, softwareShortcuts[value]);
      setShowSearchResults(isSearchResultsShow ? false : isSearchResultsShow);
    }
  };

  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewport.current?.clientWidth)
      console.log(viewport.current?.clientWidth);
  }, [viewport.current?.clientWidth]);

  if (!data.length) return null;

  return (
    <Flex pos="relative" direction="row" gap="lg" align="start">
      <ScrollArea
        type="never"
        viewportRef={viewport}
        styles={(theme) => ({
          root: {
            '&:before': {
              content: '""',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              width: 20,
              zIndex: 3,
              boxShadow: `inset ${theme.colors.dark[9]} 52px 3px 14px -42px`,
            },
            '&:after': {
              right: 0,
              content: '""',
              height: '100%',
              position: 'absolute',
              top: 0,
              width: 35,
              zIndex: 3,
              boxShadow: `inset ${theme.colors.dark[9]} -52px 4px 14px -42px`,
            },
          },
        })}
      >
        <SegmentedControl
          fullWidth
          onClick={handleClick}
          data={data}
          styles={{
            control: {
              borderColor: 'transparent !important',
            },
          }}
        />
      </ScrollArea>
      {!isSearchResultsShow && <Settings />}
    </Flex>
  );
}

export default SoftwareListContainer;
