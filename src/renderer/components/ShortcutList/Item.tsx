import { useHover } from '@mantine/hooks';
import { Flex, List, Text, Transition } from '@mantine/core';
import { Shortcut } from '../../../../@types';
import Hotkeys from '../common/ShortcutHotkeys';
import FavoriteShortcut from '../FavoriteShortcut/Container';
import EditButton from './EditButton';

type Props = { shortcut: Shortcut };

function ShortcutListItem({ shortcut }: Props) {
  const { hotkeys, description } = shortcut;
  const { hovered, ref } = useHover<HTMLLIElement>();

  return (
    <List.Item ref={ref} icon={<FavoriteShortcut shortcut={shortcut} />}>
      <Text>{description}</Text>
      <Flex gap="xs" align="center" ml={5}>
        <Hotkeys hotkeys={hotkeys} />
        <Transition mounted={hovered} transition="slide-left" duration={300}>
          {(styles) => <EditButton styles={styles} shortcut={shortcut} />}
        </Transition>
      </Flex>
    </List.Item>
  );
}

export default ShortcutListItem;
