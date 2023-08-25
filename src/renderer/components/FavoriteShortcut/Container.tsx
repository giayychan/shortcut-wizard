import { ActionIcon } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import { Shortcut } from '../../../../@types';
import { notifyClientError } from '../../utils';
import trpcReact from '../../utils/trpc';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';

type Props = { shortcut: Shortcut };

function Container({ shortcut }: Props) {
  const { isFavorite } = shortcut;

  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );
  const utils = trpcReact.useContext();
  const updateShortcut = trpcReact.shortcut.update.useMutation();

  const handleClick = async () => {
    if (!selectedSoftwareShortcut?.software.key) return;

    try {
      const updatedShortcut = { ...shortcut, isFavorite: !isFavorite };
      await updateShortcut.mutateAsync({
        shortcut: updatedShortcut,
        softwareKey: selectedSoftwareShortcut.software.key,
      });
      await utils.software.all.refetch();
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
