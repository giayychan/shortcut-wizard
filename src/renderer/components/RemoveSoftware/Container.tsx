import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import RemoveSoftwareForm from './Form';

function RemoveSoftwareContainer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Remove Software" fullScreen>
        <RemoveSoftwareForm close={close} />
      </Modal>

      <Button onClick={open}>Remove Software</Button>
    </>
  );
}

export default RemoveSoftwareContainer;
