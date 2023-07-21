import { Group } from '@mantine/core';
import Hotkey from './ShortcutHotkey';

export const mapArrayWithId = (source: any[]): any[] => {
  if (!source) return source;
  if (!Array.isArray(source)) return source;

  return source.map((value, index) => ({
    id: index,
    value: mapArrayWithId(value),
  }));
};

function Hotkeys({ hotkeys }: { hotkeys: string[][] }) {
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
