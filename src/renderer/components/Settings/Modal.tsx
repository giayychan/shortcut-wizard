import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactElement, ReactNode, cloneElement, isValidElement } from 'react';

function addPropsToReactElement<T extends ReactNode>(
  element: T,
  props: any
): ReactElement<any, any> | T {
  if (isValidElement(element)) {
    return cloneElement(element, props);
  }
  return element;
}

function addPropsToChildren<T extends ReactNode>(
  children: T | T[],
  props: any
): (ReactElement<any, any> | T)[] {
  if (!Array.isArray(children)) {
    return [addPropsToReactElement(children, props)];
  }
  return children.map((childElement) =>
    addPropsToReactElement(childElement, props)
  );
}

function SettingsModal({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title} fullScreen>
        {addPropsToChildren(children, { close })}
      </Modal>

      <Button variant="subtle" onClick={open}>
        {title}
      </Button>
    </>
  );
}

export default SettingsModal;
