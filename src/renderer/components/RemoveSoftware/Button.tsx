import { Button } from '@mantine/core';
import { openContextModal } from '@mantine/modals';

function RemoveSoftwareButton() {
  const title = 'Remove Software';

  return (
    <Button
      color="white"
      onClick={() => {
        openContextModal({
          title,
          modal: 'removeSoftware',
          innerProps: {},
        });
      }}
    >
      {title}
    </Button>
  );
}

export default RemoveSoftwareButton;
