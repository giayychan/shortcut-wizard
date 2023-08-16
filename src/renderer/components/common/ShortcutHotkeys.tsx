import { Group } from '@mantine/core';
import mapArrayWithId from '../../utils';
import Hotkey from './ShortcutHotkey';

function Hotkeys({ hotkeys }: { hotkeys: string[][] }) {
  if (!hotkeys?.length) return null;

  const indexedHotkeys = mapArrayWithId(hotkeys);

  return (
    <Group spacing="xl">
      {indexedHotkeys?.map(({ id, value: hotkey }) => {
        return <Hotkey hotkey={hotkey} key={id} />;
      })}
    </Group>
  );
}

export default Hotkeys;
