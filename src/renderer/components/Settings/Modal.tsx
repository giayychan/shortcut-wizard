import { useState } from 'react';
import dayjs from 'dayjs';
import { Text, SegmentedControl, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';

import useModalFormHeight from 'renderer/hooks/useSetModalFormHeight';
import AddShortcutButton from '../AddShortcut/Button';
import RemoveShortcutButton from '../RemoveShortcut/Button';
import SignInButton from '../Auth/SignInButton';
import FactoryResetButton from './FactoryResetButton';
import RemoveSoftwareButton from '../RemoveSoftware/Button';
import AddSoftwareButton from '../AddSoftware/Button';
import useAuthStore from '../../stores/useAuthStore';

function SettingsModal() {
  useModalFormHeight();

  const [, toggle] = useToggle();
  const [value, setValue] = useState('react');
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <form className="flex flex-col justify-center gap-5 mx-5">
      <fieldset className="flex flex-col flex-wrap justify-around gap-5 p-5 border rounded-lg">
        <legend className="px-1 text-lg">Software/Shortcut Settings</legend>
        <div className="flex gap-5">
          <AddShortcutButton />
          <RemoveShortcutButton />
        </div>
        <div className="flex gap-5">
          <AddSoftwareButton />
          <RemoveSoftwareButton />
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-5 p-5 capitalize border rounded-lg">
        <legend className="px-1 text-lg">Account Information</legend>
        <SignInButton />
        <Text size="xl">
          Current pricing plan: {user.plan?.type}{' '}
          {user.trial?.endDate ? '(trial)' : null}
        </Text>
        <Text size="xl">Current pricing interval: {user.plan?.interval}</Text>
        {user.trial?.endDate ? (
          <Text size="xl">
            Trial end date:{' '}
            {dayjs.unix(user.trial.endDate).format('DD-MMM-YYYY')}
          </Text>
        ) : null}
      </fieldset>
      <fieldset className="flex flex-col gap-5 p-5 border rounded-lg">
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
  );
}

export default SettingsModal;
