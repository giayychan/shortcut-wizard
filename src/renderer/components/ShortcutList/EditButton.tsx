import { CSSProperties } from 'react';
import { ActionIcon } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { openContextModal } from '@mantine/modals';
import { Shortcut } from '../../../../@types';

type Props = { styles: CSSProperties; shortcut: Shortcut };

function EditButton({ styles, shortcut }: Props) {
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
    <ActionIcon size="xs" onClick={handleClick} style={styles}>
      <IconEdit />
    </ActionIcon>
  );
}

export default EditButton;
