import { Checkbox, Flex, Loader, Text } from '@mantine/core';
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
    <Flex direction="column" gap="md" h="100%">
      <Text size="xl" mb={4}>
        System Setting
      </Text>
      <Flex direction="column" gap="md" className="flex-grow">
        <Checkbox
          label={
            <Flex gap="sm">
              Open app at launch{updatingAutoLaunch && <Loader size="xs" />}
            </Flex>
          }
          checked={Boolean(settings?.isAutoLaunchEnabled)}
          onChange={handleAutoLaunchChange}
        />
        <Checkbox
          label={
            <Flex gap="sm">
              Enabled: Sort software by recently opened - Disabled: Sort by
              alphabet
              {updatingSortSoftwareByRecentOpened && <Loader size="xs" />}
            </Flex>
          }
          checked={Boolean(settings?.sortSoftwareByRecentOpened)}
          onChange={handleSortChange}
        />
        <Checkbox
          label={
            <Flex gap="sm">
              Open window in center horizontally
              {updatingIsPanelAlwaysAtCenter && <Loader size="xs" />}
            </Flex>
          }
          checked={Boolean(settings?.isPanelAlwaysAtCenter)}
          onChange={handleIsPanelCenterChange}
        />
      </Flex>
      <FactoryResetButton toggle={toggle} />
    </Flex>
  );
}

export default GlobalSettings;
