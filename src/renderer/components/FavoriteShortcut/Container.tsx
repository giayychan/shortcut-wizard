import { ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconStar } from '@tabler/icons-react';
import { Shortcut } from '../../../../@types';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';

type Props = { shortcut: Shortcut };

function Container({ shortcut }: Props) {
  const { isFavorite } = shortcut;

  const updateShortcutsBySoftwareKey = useSoftwareShortcutsStore(
    (state) => state.updateShortcutBySoftwareKey
  );

  const handleClick = async () => {
    try {
      const updatedShortcut = { ...shortcut, isFavorite: !isFavorite };
      await updateShortcutsBySoftwareKey(updatedShortcut);
    } catch (error: any) {
      notifications.show({
        message: `Error when favorite a shortcut: ${error.message}`,
        color: 'red',
      });
    }
  };

  return (
    <ActionIcon size="xs" onClick={handleClick}>
      <IconStar fill={isFavorite ? 'white' : 'transparent'} />
    </ActionIcon>
  );
}

export default Container;
