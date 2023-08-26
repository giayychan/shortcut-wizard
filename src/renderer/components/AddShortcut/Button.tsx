import { Button } from '@mantine/core';
import { openContextModal } from '@mantine/modals';

function AddShortcutButton() {
  const title = 'Add Shortcut';

  return (
    <Button
      color="indigo"
      onClick={() => {
        openContextModal({
          title,
          modal: 'addShortcut',
          innerProps: {},
          closeOnEscape: false,
        });
      }}
    >
      {title}
    </Button>
  );
}

export default AddShortcutButton;
