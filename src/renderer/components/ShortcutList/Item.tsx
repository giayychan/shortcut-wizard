import { Flex, List, Text } from '@mantine/core';
import { Shortcut } from '../../../../@types';
import Hotkeys from '../common/ShortcutHotkeys';
import FavoriteShortcut from '../FavoriteShortcut/Container';
import EditButton from './EditButton';

type Props = { shortcut: Shortcut };

function ShortcutListItem({ shortcut }: Props) {
  const { hotkeys, description } = shortcut;

  return (
    <List.Item icon={<FavoriteShortcut shortcut={shortcut} />}>
      <Text>{description}</Text>
      <Flex gap="xs" align="center">
        <Hotkeys hotkeys={hotkeys} />
        <EditButton shortcut={shortcut} />
      </Flex>
    </List.Item>
  );
}

export default ShortcutListItem;
