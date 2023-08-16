import { Button, List, Text, ScrollArea } from '@mantine/core';
import { openContextModal } from '@mantine/modals';

import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import Hotkeys from '../common/ShortcutHotkeys';
import useFuseSearchStore from '../../stores/useFuseSearch';
import StyledSvg from '../common/StyledSvg';
import ShortcutListItem from './Item';

function ShortcutListContainer() {
  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const [isSearchResultsShow, searchResults] = useFuseSearchStore((state) => [
    state.isSearchResultsShow,
    state.results,
  ]);

  if (isSearchResultsShow) {
    return (
      <ScrollArea.Autosize
        type="always"
        scrollbarSize={6}
        className="border border-red-500"
      >
        <List
          mx={6}
          spacing="lg"
          size="sm"
          center
          styles={{
            itemWrapper: {
              width: '100%',
              '& > span:nth-of-type(2)': {
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            },
          }}
        >
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
                    {software.key}: {description}
                  </Text>

                  <Hotkeys hotkeys={hotkeys} />
                </List.Item>
              );
            })
          ) : (
            <Text>No results found</Text>
          )}
        </List>
      </ScrollArea.Autosize>
    );
  }

  if (!selectedSoftwareShortcut) {
    return null;
  }

  if (selectedSoftwareShortcut.shortcuts.length === 0) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          openContextModal({
            title: 'Add Shortcut',
            modal: 'addShortcut',
            innerProps: {},
          });
        }}
      >
        Add {selectedSoftwareShortcut.software.key} Shortcut
      </Button>
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
    <ScrollArea.Autosize
      type="always"
      scrollbarSize={6}
      className="border border-green-500"
    >
      <Text pl={8} pb={8} weight={700}>
        {selectedSoftwareShortcut.software.key}
      </Text>
      <List
        mx={6}
        spacing="lg"
        size="sm"
        center
        styles={{
          itemWrapper: {
            width: '100%',
            '& > span:nth-of-type(2)': {
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          },
        }}
      >
        {sortedByFavorite.map((shortcut) => {
          const { id } = shortcut;

          return <ShortcutListItem shortcut={shortcut} key={id} />;
        })}
      </List>
    </ScrollArea.Autosize>
  );
}

export default ShortcutListContainer;
