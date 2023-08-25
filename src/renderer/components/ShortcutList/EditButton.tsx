import { ActionIcon } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { openContextModal } from '@mantine/modals';
import useSelectedShortcutsStore from 'renderer/stores/useSelectedShortcutsStore';
import { Shortcut } from '../../../../@types';

type Props = { shortcut: Shortcut };

function EditButton({ shortcut }: Props) {
  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleClick = () => {
    openContextModal({
      title: `Edit shortcut - ${capitalizeFirstLetter(
        selectedSoftwareShortcut?.software.key || ''
      )}`,
      modal: 'addShortcut',
      innerProps: {
        shortcut,
      },
    });
  };

  return (
    <ActionIcon size="xs" onClick={handleClick} color="gray.6">
      <IconEdit />
    </ActionIcon>
  );
}

export default EditButton;
