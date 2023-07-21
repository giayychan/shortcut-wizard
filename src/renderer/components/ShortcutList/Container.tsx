import { Button, List, Text, ActionIcon, ScrollArea } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import { openContextModal } from '@mantine/modals';

import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import Hotkeys from '../common/ShortcutHotkeys';

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
        {selectedSoftwareShortcut.shortcuts.map((shortcut) => {
          const { hotkeys, description, isFavorite, id } = shortcut;

          return (
            <List.Item
              key={id}
              icon={
                <ActionIcon size="xs">
                  <IconStar fill={isFavorite ? 'white' : 'transparent'} />
                </ActionIcon>
              }
            >
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
