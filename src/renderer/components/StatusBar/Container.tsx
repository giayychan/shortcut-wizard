import { Loader, Badge } from '@mantine/core';
import useAuthStore from '../../stores/useAuthStore';
import useConnectedStore from '../../stores/useConnectedStore';

export default function StatusBarContainer() {
  const [connected, connectedLoading] = useConnectedStore((state) => [
    state.connected,
    state.loading,
  ]);
  const authLoading = useAuthStore((state) => state.loading);

  const loading = connectedLoading || authLoading;

  if (!loading && connected) return null;

  if (!loading && !connected) {
    return (
      <div className="absolute right-0 pr-5">
        <Badge variant="gradient" gradient={{ from: 'red', to: 'orange' }}>
          You&apos;re offline
        </Badge>
      </div>
    );
  }

  return (
    <div className="absolute right-0 pr-5">
      <Loader size="xs" />
    </div>
  );
}
