import { ActionIcon } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import { Shortcut } from '../../../../@types';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import { notifyClientError } from '../../utils';

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
      notifyClientError(`Error when favorite a shortcut: ${error.message}`);
    }
  };

  return (
    <ActionIcon size="xs" onClick={handleClick} color="gray.6">
      <IconStar fill={isFavorite ? 'gray' : 'transparent'} />
    </ActionIcon>
  );
}

export default Container;
