import { useEffect, useState } from 'react';
import { Checkbox, Flex, Group, Loader, TextInput } from '@mantine/core';

import trpcReact from '../../utils/trpc';
import FactoryResetButton from './FactoryResetButton';

function GlobalSettings() {
  const { data: settings, refetch } = trpcReact.settings.get.useQuery();
  const utils = trpcReact.useContext();

  const options = {
    onSuccess: async () => {
      await refetch();
    },
  };

  const { mutate: toggleAiSearch, isLoading: updatingEnabledAiSearch } =
    trpcReact.shortcut.ai.toggleAiSearch.useMutation({
      onSuccess: async () => {
        await refetch();
        await utils.shortcut.ai.enabledAiSearch.refetch();
      },
    });

  const { mutate: updateOpenAIApiKey } =
    trpcReact.shortcut.ai.updateOpenAIApiKey.useMutation(options);

  const { mutateAsync: updateAutoLaunch, isLoading: updatingAutoLaunch } =
    trpcReact.settings.autoLaunch.useMutation(options);

  const {
    mutate: updateSortSoftwareByRecentOpened,
    isLoading: updatingSortSoftwareByRecentOpened,
  } = trpcReact.settings.sortSoftwareByRecentOpened.useMutation(options);

  const {
    mutate: updateIsPanelAlwaysAtCenter,
    isLoading: updatingIsPanelAlwaysAtCenter,
  } = trpcReact.settings.isPanelAlwaysAtCenter.useMutation(options);

  const handleAutoLaunchChange = async () => {
    await updateAutoLaunch(!settings?.isAutoLaunchEnabled);
  };

  const handleSortChange = () => {
    updateSortSoftwareByRecentOpened(!settings?.sortSoftwareByRecentOpened);
  };

  const handleIsPanelCenterChange = () => {
    updateIsPanelAlwaysAtCenter(!settings?.isPanelAlwaysAtCenter);
  };

  const handleToggleEnabledAiSearch = async () => {
    toggleAiSearch(!settings?.enabledAiSearch);
  };

  const [apiKeyInput, setApiKeyInput] = useState(settings?.openAIApiKey);

  useEffect(() => {
    setApiKeyInput(settings?.openAIApiKey || '');
  }, [settings?.openAIApiKey]);

  const handleApiKeyInputChange = (event: any) => {
    setApiKeyInput(event.currentTarget.value);
  };

  const handleUpdateOpenAIApiKey = async () => {
    if (!apiKeyInput) return;
    updateOpenAIApiKey(apiKeyInput);
  };

  return (
    <Flex direction="column" gap="md">
      <FactoryResetButton />
      <Checkbox
        label={
          <Group>
            Open app at launch
            {updatingAutoLaunch && <Loader size="xs" />}
          </Group>
        }
        checked={settings?.isAutoLaunchEnabled}
        onChange={handleAutoLaunchChange}
      />
      <Checkbox
        label={
          <Group>
            Sort software by recent opened, otherwise sort by alphabet
            {updatingSortSoftwareByRecentOpened && <Loader size="xs" />}
          </Group>
        }
        checked={settings?.sortSoftwareByRecentOpened}
        onChange={handleSortChange}
      />
      <Checkbox
        label={
          <Group>
            Panel always at center
            {updatingIsPanelAlwaysAtCenter && <Loader size="xs" />}
          </Group>
        }
        checked={settings?.isPanelAlwaysAtCenter}
        onChange={handleIsPanelCenterChange}
      />
      <Checkbox
        styles={{ labelWrapper: { flexGrow: 1 } }}
        label={
          <Flex direction="column" gap="xs">
            <Group>
              Enabled AI search
              {updatingEnabledAiSearch && <Loader size="xs" />}
            </Group>
            <TextInput
              label="OpenAI api key"
              type="password"
              value={apiKeyInput}
              disabled={!settings?.enabledAiSearch}
              onBlur={handleUpdateOpenAIApiKey}
              onChange={handleApiKeyInputChange}
            />
          </Flex>
        }
        checked={settings?.enabledAiSearch}
        onChange={handleToggleEnabledAiSearch}
      />
    </Flex>
  );
}

export default GlobalSettings;
