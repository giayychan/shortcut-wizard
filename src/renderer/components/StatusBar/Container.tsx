import { Indicator, Flex, Text, Loader } from '@mantine/core';
import useAuthStore from '../../stores/useAuthStore';
import useConnectedStore from '../../stores/useConnectedStore';

export default function StatusBarContainer() {
  const [connected, loading] = useConnectedStore((state) => [
    state.connected,
    state.loading,
  ]);
  const authLoading = useAuthStore((state) => state.loading);

  return (
    <Flex bg="red">
      <Loader size="xs" />
      {/* {!connected ? (
        <div>
          <Indicator
            position="middle-end"
            size={7}
            processing={loading || authLoading}
            color={loading || authLoading ? 'yellow' : 'red'}
          >
            <Text size={14} pr={5}>
              {loading || authLoading ? 'Connecting' : 'You are offline.'}
            </Text>
          </Indicator>
        </div>
      ) : null} */}
    </Flex>
  );
}
