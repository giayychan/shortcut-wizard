import { useEffect, useRef } from 'react';
import {
  Button,
  Flex,
  ScrollArea,
  SegmentedControl,
  Skeleton,
} from '@mantine/core';
import { IconInputSearch } from '@tabler/icons-react';
import { openContextModal } from '@mantine/modals';

import StyledSvg from '../common/StyledSvg';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import { SoftwareShortcut } from '../../../../@types';
import useFuseSearchStore from '../../stores/useFuseSearch';
import trpcReact from '../../utils/trpc';

function SoftwareList({
  softwareShortcuts,
}: {
  softwareShortcuts: SoftwareShortcut[];
}) {
  const [selected, setSelected] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
    state.setSelectedSoftwareShortcut,
  ]);

  if (softwareShortcuts.length === 0) return null;

  const handleSelect = (key: string) => {
    if (selected?.software.key === key) {
      setSelected(null);
    } else {
      const selectedSoftwareData = softwareShortcuts.find(
        (softwareData) => softwareData.software.key === key
      );
      setSelected(selectedSoftwareData || null);
    }
  };

  return (
    <ScrollArea type="auto" scrollbarSize={5} offsetScrollbars>
      <div className="flex flex-row px-3.5 overflow-auto">
        {softwareShortcuts.map((softwareData) => {
          const { software } = softwareData;
          const { key, icon } = software;
          const isSelected = selected?.software.key === key;

          return (
            <Button
              h={60}
              variant={isSelected ? 'light' : 'subtle'}
              onClick={() => handleSelect(key)}
            >
              <Flex
                direction="column"
                align="center"
                className="capitalize"
                gap={5}
              >
                <StyledSvg src={icon.dataUri} />
                {key}
              </Flex>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function SoftwareListOld({
  softwareShortcuts,
}: {
  softwareShortcuts: SoftwareShortcut[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const softwares = softwareShortcuts.map((softwareData) => {
    const { software } = softwareData;
    const { key, icon } = software;
    const { dataUri } = icon;

    return {
      value: key,
      label: dataUri ? (
        <Flex direction="column" align="center" className="capitalize">
          <StyledSvg src={dataUri} />
          {key}
        </Flex>
      ) : null,
    };
  });

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

  const [selected, setSelected] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
    state.setSelectedSoftwareShortcut,
  ]);

  const handleSelect = (
    isSelected: boolean,
    softwareShortcut: SoftwareShortcut
  ) => {
    setSelected(isSelected ? null : softwareShortcut);
  };

  const handleClick = (e: any) => {
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

  const data = [...searchItem, ...softwares];

  if (!data?.length) return null;

  return (
    <ScrollArea type="auto" scrollbarSize={6} offsetScrollbars>
      <SegmentedControl
        ref={ref}
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
  );
}

function SoftwareListContainer() {
  const { data, isLoading } = trpcReact.software.all.useQuery();

  const [selectedSoftware, setSelectedSoftware] = useSelectedShortcutsStore(
    (state) => [
      state.selectedSoftwareShortcut,
      state.setSelectedSoftwareShortcut,
    ]
  );

  useEffect(() => {
    if (selectedSoftware) {
      if (data) {
        const updatedSelectedSoftware = data.find((softwareShortcut) => {
          return (
            softwareShortcut.software.key === selectedSoftware.software.key
          );
        });
        if (updatedSelectedSoftware)
          setSelectedSoftware(updatedSelectedSoftware);
      } else setSelectedSoftware(null);

      // todo: remove search results
    }
  }, [selectedSoftware, setSelectedSoftware, data]);

  if (isLoading) return <Skeleton h={70} />;

  if (!data?.length)
    return (
      <div className="ml-4 h-[70px]">
        <Button
          variant="outline"
          onClick={() =>
            openContextModal({
              modal: 'openSettings',
              fullScreen: true,
              withCloseButton: false,
              innerProps: {
                selectedSettingsTab: 2,
              },
            })
          }
        >
          Add software
        </Button>
      </div>
    );

  return <SoftwareList softwareShortcuts={data} />;
}

export default SoftwareListContainer;
