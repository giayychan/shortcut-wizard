import { useToggle } from '@mantine/hooks';
import { useState } from 'react';
import { Button, Flex, Text } from '@mantine/core';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import useFuseSearchStore from '../../stores/useFuseSearch';
import { notifyClientError, notifyClientInfo } from '../../utils';
import trpcReact from '../../utils/trpc';

function FactoryResetButton() {
  const [, toggle] = useToggle();

  const factoryReset = trpcReact.settings.factoryReset.useMutation();
  const [confirmed, setConfirmed] = useState(false);
  const utils = trpcReact.useContext();

  const setSelectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.setSelectedSoftwareShortcut
  );
  const resetFuseSearch = useFuseSearchStore((state) => state.reset);

  const handleClick = async () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    try {
      await factoryReset.mutateAsync();
      await utils.software.all.refetch();
      await utils.settings.get.refetch();
      await utils.shortcut.ai.enabledAiSearch.refetch();

      setSelectedSoftwareShortcut(null);
      resetFuseSearch();
      toggle(false);
      setConfirmed(false);
      notifyClientInfo('Factory reset successful');
    } catch (error: any) {
      notifyClientError(`Error when factory resetting: ${error.message}`);
    }
  };

  return (
    <Flex gap={10} align="center">
      <Button variant={confirmed ? 'filled' : 'light'} onClick={handleClick}>
        {confirmed ? 'Confirm Reset?' : 'Factory Reset'}
      </Button>
      <Text size="sm">This will reset everything to default</Text>
    </Flex>
  );
}

export default FactoryResetButton;
