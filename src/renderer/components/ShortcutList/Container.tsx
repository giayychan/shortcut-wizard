import { ReactNode } from 'react';
import { Button, List, Text, ScrollArea } from '@mantine/core';
import { openContextModal } from '@mantine/modals';
import { useSearchParams } from 'react-router-dom';

import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import Hotkeys from '../common/ShortcutHotkeys';
import useFuseSearchStore from '../../stores/useFuseSearch';
import StyledSvg from '../common/StyledSvg';
import ShortcutListItem from './Item';

const listStyles = {
  itemWrapper: {
    width: '100%',
    '& > span:nth-of-type(2)': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
};

function ScrollableListWrapper({ children }: { children: ReactNode }) {
  return (
    <ScrollArea.Autosize
      scrollbarSize={5}
      type="auto"
      offsetScrollbars
      className="ml-4"
    >
      <List m={10} spacing="lg" size="sm" center styles={listStyles}>
        {children}
      </List>
    </ScrollArea.Autosize>
  );
}

function ShortcutListContainer() {
  const [, setSearchParams] = useSearchParams();
  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const [isSearchResultsShow, searchResults] = useFuseSearchStore((state) => [
    state.isSearchResultsShow,
    state.results,
  ]);

  if (isSearchResultsShow) {
    return (
      <ScrollableListWrapper>
        {searchResults.length ? (
          searchResults.map(({ item }) => {
            const { hotkeys, description, id, software } = item;

            return (
              <List.Item
                key={id}
                icon={
                  software.icon.dataUri && (
                    <StyledSvg src={software.icon.dataUri} />
                  )
                }
              >
                <Text>
                  {software.label}: {description}
                </Text>

                <Hotkeys hotkeys={hotkeys} />
              </List.Item>
            );
          })
        ) : (
          <Text>No results found</Text>
        )}
      </ScrollableListWrapper>
    );
  }

  if (!selectedSoftwareShortcut) {
    return null;
  }

  if (selectedSoftwareShortcut.shortcuts.length === 0) {
    return (
      <div className="px-4 pb-4">
        <Button
          variant="light"
          onClick={() => {
            openContextModal({
              modal: 'openSettings',
              fullScreen: true,
              withCloseButton: false,
              innerProps: { selectedSettingsTab: 'Add Shortcut' },
            });
            setSearchParams({ from: 'main' });
          }}
        >
          Add {selectedSoftwareShortcut.software.label} Shortcut
        </Button>
      </div>
    );
  }

  const sortedByFavorite = [...selectedSoftwareShortcut.shortcuts].sort(
    (a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    }
  );

  return (
    <ScrollableListWrapper>
      {sortedByFavorite.map((shortcut) => (
        <ShortcutListItem shortcut={shortcut} key={shortcut.id} />
      ))}
    </ScrollableListWrapper>
  );
}

export default ShortcutListContainer;
