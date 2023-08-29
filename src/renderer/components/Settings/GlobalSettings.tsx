import { Checkbox, Group, Loader } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import trpcReact from '../../utils/trpc';
import FactoryResetButton from './FactoryResetButton';

function GlobalSettings() {
  const [, toggle] = useToggle();
  const autoLaunch = trpcReact.settings.autoLaunch.useMutation();

  const { data: isAutoLaunchEnabled, refetch } =
    trpcReact.settings.isAutoLaunchEnabled.useQuery();

  const handleAutoLaunchChange = async () => {
    await autoLaunch.mutateAsync(!isAutoLaunchEnabled);
    await refetch();
  };

  return (
    <>
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
    </>
  );
}

export default GlobalSettings;
