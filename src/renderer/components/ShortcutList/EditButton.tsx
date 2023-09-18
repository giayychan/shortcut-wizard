import { useSearchParams } from 'react-router-dom';
import { ActionIcon } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { openContextModal } from '@mantine/modals';
import { Shortcut } from '../../../../@types';

type Props = { shortcut: Shortcut };

function EditButton({ shortcut }: Props) {
  const [, setSearchParams] = useSearchParams();

  const handleClick = () => {
    openContextModal({
      modal: 'openSettings',
      fullScreen: true,
      withCloseButton: false,
      innerProps: {
        selectedSettingsTab: 'Add Shortcut',
      },
    });

    setSearchParams({ shortcutId: shortcut.id, from: 'main' });
  };

  return (
    <ActionIcon size="1rem" onClick={handleClick} color="gray.6">
      <IconEdit />
    </ActionIcon>
  );
}

export default EditButton;
