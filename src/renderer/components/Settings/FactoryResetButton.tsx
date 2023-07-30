import { SetStateAction, useState } from 'react';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import useFuseSearchStore from '../../stores/useFuseSearch';

function FactoryResetButton({
  toggle,
}: {
  toggle: (value?: SetStateAction<boolean> | undefined) => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const fetchSoftwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.fetchSoftwareShortcuts
  );

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
      const { ipcRenderer } = window.electron;
      await ipcRenderer.invoke('factoryReset', undefined);

      fetchSoftwareShortcuts();
      setSelectedSoftwareShortcut(null);
      resetFuseSearch();
      toggle(false);
      setConfirmed(false);
    } catch (error: any) {
      notifications.show({
        message: `Error when factory resetting: ${error.message}`,
        color: 'red',
      });
    }
  };

  return (
    <Button color="white" onClick={handleClick}>
      {confirmed ? 'Confirm Reset?' : 'Factory Reset'}
    </Button>
  );
}

export default FactoryResetButton;
