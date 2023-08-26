import dayjs from 'dayjs';
import { Text, Button, Checkbox, Loader, Group } from '@mantine/core';
import { useToggle } from '@mantine/hooks';

import useModalFormHeight from 'renderer/hooks/useSetModalFormHeight';
import AddShortcutButton from '../AddShortcut/Button';
import RemoveShortcutButton from '../RemoveShortcut/Button';
import SignInButton from '../Auth/SignInButton';
import FactoryResetButton from './FactoryResetButton';
import RemoveSoftwareButton from '../RemoveSoftware/Button';
import AddSoftwareButton from '../AddSoftware/Button';
import useAuthStore from '../../stores/useAuthStore';
import trpcReact from '../../utils/trpc';

function SettingsModal() {
  useModalFormHeight();

  const [, toggle] = useToggle();
  const user = useAuthStore((state) => state.user);
  const autoLaunch = trpcReact.settings.autoLaunch.useMutation();
  const { data: isAutoLaunchEnabled, refetch } =
    trpcReact.settings.isAutoLaunchEnabled.useQuery();

  if (!user) return null;

  const handleAutoLaunchChange = async () => {
    await autoLaunch.mutateAsync(!isAutoLaunchEnabled);
    await refetch();
  };

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
        <FactoryResetButton toggle={toggle} />
        <Checkbox
          label={
            <Group>
              Open app at launch
              {autoLaunch.isLoading && <Loader size="xs" />}
            </Group>
          }
          checked={Boolean(isAutoLaunchEnabled)}
          onChange={handleAutoLaunchChange}
        />
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
