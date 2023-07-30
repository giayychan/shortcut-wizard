import { Flex, ScrollArea, SegmentedControl } from '@mantine/core';
import { IconInputSearch } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

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

  const softwares = softwareList?.length
    ? softwareList
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

  const getIsScrollable = (ele: HTMLElement) => {
    // Compare the height to see if the element has scrollable content
    const hasScrollableContent = ele.scrollWidth > ele.clientWidth;

    // It's not enough because the element's `overflow-y` style can be set as
    // * `hidden`
    // * `hidden !important`
    // In those cases, the scrollbar isn't shown
    const overflowXStyle = window.getComputedStyle(ele).overflowX;
    const isOverflowHidden = overflowXStyle.indexOf('hidden') !== -1;

    return hasScrollableContent && !isOverflowHidden;
  };

  const viewport = useRef<HTMLDivElement>(null);

  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    if (viewport.current?.scrollWidth) {
      const isScrollableEle = getIsScrollable(viewport.current);
      setIsScrollable(isScrollableEle);
    }
  }, [viewport.current?.scrollWidth, viewport.current?.clientWidth]);

  if (!data.length) return null;

  return (
    <Flex pos="relative" direction="row" gap="lg" align="start" mb={10}>
      <ScrollArea
        type="never"
        viewportRef={viewport}
        styles={(theme) => ({
          root: isScrollable
            ? {
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
                borderRadius: 8,
              }
            : { borderRadius: 8 },
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
