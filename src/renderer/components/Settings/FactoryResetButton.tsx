import { SetStateAction, useState } from 'react';
import { Button } from '@mantine/core';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import useFuseSearchStore from '../../stores/useFuseSearch';
import { notifyClientError } from '../../utils';
import trpcReact from '../../utils/trpc';

function FactoryResetButton({
  toggle,
}: {
  toggle: (value?: SetStateAction<boolean> | undefined) => void;
}) {
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
      setSelectedSoftwareShortcut(null);
      resetFuseSearch();
      toggle(false);
      setConfirmed(false);
    } catch (error: any) {
      notifyClientError(`Error when factory resetting: ${error.message}`);
    }
  };

  return (
    <Button color="red" uppercase onClick={handleClick}>
      {confirmed ? 'Confirm Reset?' : 'Factory Reset'}
    </Button>
  );
}

export default FactoryResetButton;
