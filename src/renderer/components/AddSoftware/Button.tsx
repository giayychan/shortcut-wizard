import { Button } from '@mantine/core';
import { openContextModal } from '@mantine/modals';

function AddSoftwareButton() {
  const title = 'Add Software';

  return (
    <Button
      variant="subtle"
      onClick={() => {
        openContextModal({
          title,
          modal: 'addSoftware',
          innerProps: {},
        });
      }}
    >
      {title}
    </Button>
  );
}

export default AddSoftwareButton;
