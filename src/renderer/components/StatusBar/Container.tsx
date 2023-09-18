import { useEffect } from 'react';
import { Loader, Badge } from '@mantine/core';
import useConnectedStore from '../../stores/useConnectedStore';
import useAuthStore from '../../stores/useAuthStore';

export default function StatusBarContainer() {
  const [connected, onConnected] = useConnectedStore((state) => [
    state.connected,
    state.onConnected,
  ]);

  const [user, loading] = useAuthStore((state) => [state.user, state.loading]);

  const isAuth = user && !loading && connected;
  const isNotAuth = !user && !loading && connected;

  useEffect(() => {
    onConnected();
  }, [onConnected]);

  const getBadgeText = () => {
    if (isNotAuth) return 'Please sign in';
    if (isAuth) return `Hi, ${user?.displayName ?? 'user'}`;

    return 'Connecting...';
  };

  const getGradient = () => {
    if (isNotAuth) return { from: 'indigo', to: 'red' };
    if (isAuth) return { from: 'indigo', to: 'green' };

    return { from: 'indigo', to: 'blue' };
  };

  return (
    <div className="absolute right-0 pr-5">
      <Badge
        variant="gradient"
        gradient={getGradient()}
        className="flex flex-row items-center"
      >
        {getBadgeText()}{' '}
        {loading && <Loader size={13} className="inline-block" />}
      </Badge>
    </div>
  );
}
