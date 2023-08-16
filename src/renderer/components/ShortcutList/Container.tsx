import { Button, List, Text, ScrollArea, Anchor } from '@mantine/core';
import { openContextModal } from '@mantine/modals';
import { BASIC_SHORTCUT_LIMIT } from 'main/constants';

import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import Hotkeys from '../common/ShortcutHotkeys';
import useFuseSearchStore from '../../stores/useFuseSearch';
import StyledSvg from '../common/StyledSvg';
import ShortcutListItem from './Item';
import useAuthStore from '../../stores/useAuthStore';

function ShortcutListContainer() {
  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const user = useAuthStore((state) => state.user);

  const isFeatureLimited = !user || user.plan_type === 'basic';

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
        {sortedByFavorite.map((shortcut, index) => {
          const { id } = shortcut;
          const count = index + 1;

          if (isFeatureLimited && count > BASIC_SHORTCUT_LIMIT) return null;

          return <ShortcutListItem shortcut={shortcut} key={id} />;
        })}
        {isFeatureLimited && sortedByFavorite.length > BASIC_SHORTCUT_LIMIT ? (
          <Text>
            <Anchor
              target="_blank"
              href="https://shortcut-wizard.vercel.app/pricing"
            >
              Upgrade
            </Anchor>{' '}
            to display all shortcuts
          </Text>
        ) : null}
      </List>
    </ScrollArea.Autosize>
  );
}

export default ShortcutListContainer;
