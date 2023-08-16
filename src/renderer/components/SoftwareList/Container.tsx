import React, { useMemo, useCallback, useRef } from 'react';
import { Anchor, Flex, ScrollArea, SegmentedControl } from '@mantine/core';
import { IconInputSearch } from '@tabler/icons-react';
import { BASIC_SOFTWARE_LIMIT } from 'main/constants';

import StyledSvg from '../common/StyledSvg';
// import SettingsMenu from '../Settings/Container';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import { SoftwareShortcut } from '../../../../@types';
import useFuseSearchStore from '../../stores/useFuseSearch';
import SettingsButton from '../Settings/Button';
import useAuthStore from '../../stores/useAuthStore';

function SoftwareListContainer() {
  // const { data: softwareShortcuts } = trpcReact.software.all.useQuery();

  const softwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.softwareShortcuts
  );

  const ref = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);

  const isFeatureLimited = !user || user.plan_type === 'basic';

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
      .map((softwareKey, index) => {
        const { software } = softwareShortcuts[softwareKey];
        const { key, icon } = software;
        const { dataUri } = icon;

        const display =
          isFeatureLimited && index === BASIC_SOFTWARE_LIMIT ? (
            <>
              <Anchor
                bg="dark"
                className="absolute z-10 left-2 top-1"
                target="_blank"
                href="https://shortcut-wizard.vercel.app/pricing"
              >
                Upgrade your plan to add more apps
              </Anchor>
              <StyledSvg src={dataUri} />
            </>
          ) : (
            <StyledSvg src={dataUri} />
          );

        return {
          value: key,
          label: dataUri ? display : null,
          disabled: isFeatureLimited && index + 1 > BASIC_SOFTWARE_LIMIT,
        };
      });
  }, [softwareList, softwareShortcuts, isFeatureLimited]);

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
      {/* {!isSearchResultsShow && <SettingsMenu />} */}
      <SettingsButton />
    </Flex>
  );
}

export default React.memo(SoftwareListContainer);
