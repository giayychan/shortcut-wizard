import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AddSoftwareForm from './Form';

function AddSoftwareContainer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Software" fullScreen>
        <AddSoftwareForm close={close} />
      </Modal>

      <Button onClick={open}>Add Software</Button>
    </>
  );
}

export default AddSoftwareContainer;
