import { useState } from 'react';

import { Text, SegmentedControl, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { ContextModalProps } from '@mantine/modals';

import useModalFormHeight from 'renderer/hooks/useSetModalFormHeight';
import AddShortcutButton from '../AddShortcut/Button';
import RemoveShortcutButton from '../RemoveShortcut/Button';
import SignInButton from '../Auth/SignInButton';
import FactoryResetButton from './FactoryResetButton';
import RemoveSoftwareButton from '../RemoveSoftware/Button';
import AddSoftwareButton from '../AddSoftware/Button';

function SettingsModal({
  innerProps,
}: ContextModalProps<{
  modalBody: string;
}>) {
  // const [visible, { close: closeLoading, open: openLoading }] =
  //   useDisclosure(false);
  useModalFormHeight();

  const [, toggle] = useToggle();
  const [value, setValue] = useState('react');

  return (
    <>
      {/* <LoadingOverlay visible={visible} overlayBlur={2} /> */}
      <form className="mx-5 gap-5 flex flex-col justify-center">
        <fieldset className="p-5 border rounded-lg gap-5 flex flex-wrap flex-col justify-around">
          <legend className="px-1 text-lg">Software/Shortcut Settings</legend>
          <div className="gap-5 flex">
            <AddShortcutButton />
            <RemoveShortcutButton />
          </div>
          <div className="gap-5 flex">
            <AddSoftwareButton />
            <RemoveSoftwareButton />
          </div>
        </fieldset>
        <fieldset className="p-5 border rounded-lg flex flex-col gap-5">
          <legend className="px-1 text-lg">Account Information</legend>
          <SignInButton />
          <Text size="xl">Current pricing plan: </Text>
        </fieldset>
        <fieldset className="p-5 border rounded-lg flex flex-col gap-5">
          <legend className="px-1 text-lg">Global Settings</legend>
          <div className="flex flex-row items-center justify-between">
            <Text size="xl">Operating System / Keyboard layout: </Text>
            <SegmentedControl
              size="sm"
              radius="sm"
              color="blue"
              value={value}
              onChange={setValue}
              data={[
                { label: 'Mac', value: 'mac' },
                { label: 'Windows', value: 'win' },
              ]}
            />
          </div>
          <FactoryResetButton toggle={toggle} />
        </fieldset>
        <div className="flex flex-row justify-between">
          <Text size="xl">Have feedback on Shortcut Wizard? </Text>
          <Button type="button" color="indigo">
            Contact Us
          </Button>
        </div>
      </form>
    </>
  );
}

export default SettingsModal;
