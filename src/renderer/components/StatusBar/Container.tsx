import { useEffect } from 'react';
import { Loader, Badge } from '@mantine/core';
import useConnectedStore from '../../stores/useConnectedStore';

export default function StatusBarContainer() {
  const [connected, onConnected] = useConnectedStore((state) => [
    state.connected,
    state.onConnected,
  ]);

  useEffect(() => {
    onConnected();
  }, [onConnected]);

  if (connected) return null;

  return (
    <div className="absolute right-0 pr-5">
      <Badge
        variant="gradient"
        gradient={{ from: 'indigo', to: 'blue' }}
        className="flex flex-row items-center"
      >
        You&apos;re offline <Loader size={13} className="inline-block" />
      </Badge>
    </div>
  );
}
