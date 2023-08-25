import { useRef } from 'react';
import {
  Button,
  Flex,
  ScrollArea,
  SegmentedControl,
  Skeleton,
} from '@mantine/core';
import { IconInputSearch } from '@tabler/icons-react';
import { isEmpty } from 'lodash';

import StyledSvg from '../common/StyledSvg';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import { SoftwareShortcut, SoftwareShortcuts } from '../../../../@types';
import useFuseSearchStore from '../../stores/useFuseSearch';
import trpcReact from '../../utils/trpc';

function SoftwareList({
  softwareShortcuts,
}: {
  softwareShortcuts: SoftwareShortcuts;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const softwareList = Object.keys(softwareShortcuts);

  const softwares = softwareList
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
  );
}

function SoftwareListContainer() {
  const { data: softwareShortcuts, isLoading } =
    trpcReact.software.all.useQuery();

  if (isLoading) return <Skeleton h={48} />;

  if ((!isLoading && !softwareShortcuts) || isEmpty(softwareShortcuts))
    return <Button>Add software shortcuts</Button>;

  return <SoftwareList softwareShortcuts={softwareShortcuts} />;
}

export default SoftwareListContainer;
