import { ReactNode, useEffect } from 'react';
import trpcReact from '../utils/trpc';
import useIsDevStore from '../stores/useIsDevStore';

function SettingsProvider({ children }: { children: ReactNode }) {
  trpcReact.settings.processPlatform.useQuery();
  const { data: isDev } = trpcReact.settings.isDev.useQuery();

  const setIsDev = useIsDevStore((state) => state.setIsDev);

  useEffect(() => {
    if (isDev !== undefined) setIsDev(isDev);
  }, [setIsDev, isDev]);

  return children;
}

export default SettingsProvider;
