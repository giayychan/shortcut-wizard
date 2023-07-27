import { ActionIcon } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { openContextModal } from '@mantine/modals';
import { Shortcut } from '../../../../@types';

type Props = { shortcut: Shortcut };

function EditButton({ shortcut }: Props) {
  const handleClick = () => {
    openContextModal({
      title: 'Edit shortcut',
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
