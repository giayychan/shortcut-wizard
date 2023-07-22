import { Button, List, Text, ScrollArea } from '@mantine/core';
import { openContextModal } from '@mantine/modals';

import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import Hotkeys from '../common/ShortcutHotkeys';
import FavoriteShortcut from '../FavoriteShortcut/Container';

function ShortcutListContainer() {
  const [selectedSoftwareShortcut] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
  ]);

  if (!selectedSoftwareShortcut) {
    return null;
  }

  if (selectedSoftwareShortcut.shortcuts.length === 0) {
    return (
      <Button
        className="mt-4"
        onClick={() => {
          openContextModal({
            title: 'Add Shortcut',
            modal: 'addShortcut',
            innerProps: {},
          });
        }}
      >
        Add Shortcut
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
    <ScrollArea.Autosize mah={300} scrollHideDelay={1500}>
      <List
        mx={6}
        spacing="lg"
        size="sm"
        center
        className="first:mt-4"
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
          const { hotkeys, description, id } = shortcut;

          return (
            <List.Item key={id} icon={<FavoriteShortcut shortcut={shortcut} />}>
              <Text>{description}</Text>

              <Hotkeys hotkeys={hotkeys} />
            </List.Item>
          );
        })}
      </List>
    </ScrollArea.Autosize>
  );
}

export default ShortcutListContainer;
