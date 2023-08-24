import { Indicator, Text } from '@mantine/core';
import useAuthStore from '../../stores/useAuthStore';
import useConnectedStore from '../../stores/useConnectedStore';

export default function StatusBarContainer() {
  const [connected, loading] = useConnectedStore((state) => [
    state.connected,
    state.loading,
  ]);
  const authLoading = useAuthStore((state) => state.loading);

  return (
    <div className="absolute right-0 pr-5">
      <Indicator
        position="middle-end"
        size={7}
        processing={loading || authLoading}
        color={loading || authLoading ? 'yellow' : 'red'}
        disabled={connected}
      >
        <Text size={14} pr={5} hidden={connected}>
          {loading || authLoading ? 'Connecting' : 'You are offline'}
        </Text>
      </Indicator>
    </div>
  );
}
