import { Checkbox, Flex, Group, Loader } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import trpcReact from '../../utils/trpc';
import FactoryResetButton from './FactoryResetButton';

function GlobalSettings() {
  const [, toggle] = useToggle();
  const { data: settings, refetch } = trpcReact.settings.get.useQuery();

  const { mutateAsync: updateAutoLaunch, isLoading: updatingAutoLaunch } =
    trpcReact.settings.autoLaunch.useMutation({
      onSuccess: async () => {
        await refetch();
      },
    });

  const {
    mutateAsync: updateSortSoftwareByRecentOpened,
    isLoading: updatingSortSoftwareByRecentOpened,
  } = trpcReact.settings.sortSoftwareByRecentOpened.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const {
    mutateAsync: updateIsPanelAlwaysAtCenter,
    isLoading: updatingIsPanelAlwaysAtCenter,
  } = trpcReact.settings.isPanelAlwaysAtCenter.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const handleAutoLaunchChange = async () => {
    await updateAutoLaunch(!settings?.isAutoLaunchEnabled);
  };

  const handleSortChange = async () => {
    await updateSortSoftwareByRecentOpened(
      !settings?.sortSoftwareByRecentOpened
    );
  };

  const handleIsPanelCenterChange = async () => {
    await updateIsPanelAlwaysAtCenter(!settings?.isPanelAlwaysAtCenter);
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
        onChange={handleSortChange}
      />
      <Checkbox
        label={
          <Group>
            Panel always at center
            {updatingIsPanelAlwaysAtCenter && <Loader size="xs" />}
          </Group>
        }
        checked={Boolean(settings?.isPanelAlwaysAtCenter)}
        onChange={handleIsPanelCenterChange}
      />
    </Flex>
  );
}

export default GlobalSettings;
