import { Checkbox, Flex, Group, Loader } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import trpcReact from '../../utils/trpc';
import FactoryResetButton from './FactoryResetButton';

function GlobalSettings() {
  const [, toggle] = useToggle();

  const { mutateAsync: updateAutoLaunch, isLoading: updatingAutoLaunch } =
    trpcReact.settings.autoLaunch.useMutation();
  const {
    mutateAsync: updateSortSoftwareByRecentOpened,
    isLoading: updatingSortSoftwareByRecentOpened,
  } = trpcReact.settings.sortSoftwareByRecentOpened.useMutation();

  const { data: settings, refetch } = trpcReact.settings.get.useQuery();

  const handleAutoLaunchChange = async () => {
    await updateAutoLaunch(!settings?.isAutoLaunchEnabled);
    await refetch();
  };

  const handleChange = async () => {
    await updateSortSoftwareByRecentOpened(
      !settings?.sortSoftwareByRecentOpened
    );
    await refetch();
  };

  return (
    <Flex direction="column" gap="md">
      <FactoryResetButton toggle={toggle} />
      <Checkbox
        label={
          <Group>
            Open app at launch
            {updatingAutoLaunch && <Loader size="xs" />}
          </Group>
        }
        checked={Boolean(settings?.isAutoLaunchEnabled)}
        onChange={handleAutoLaunchChange}
      />
      <Checkbox
        label={
          <Group>
            Sort software by recent opened, otherwise sort by alphabet
            {updatingSortSoftwareByRecentOpened && <Loader size="xs" />}
          </Group>
        }
        checked={Boolean(settings?.sortSoftwareByRecentOpened)}
        onChange={handleChange}
      />
    </Flex>
  );
}

export default GlobalSettings;
