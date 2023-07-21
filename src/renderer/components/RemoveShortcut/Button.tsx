import { Button } from '@mantine/core';
import { openContextModal } from '@mantine/modals';

function RemoveShortcutButton() {
  const title = 'Remove Shortcut';

  return (
    <Button
      variant="subtle"
      onClick={() => {
        openContextModal({
          title,
          modal: 'removeShortcut',
          innerProps: {},
        });
      }}
    >
      {title}
    </Button>
  );
}

export default RemoveShortcutButton;
