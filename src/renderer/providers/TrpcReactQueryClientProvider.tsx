import { ReactNode, useState } from 'react';
import { ipcLink } from 'electron-trpc/renderer';
import superjson from 'superjson';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import trpcReact from '../utils/trpc';

function TrpcReactQueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            networkMode: 'offlineFirst',
          },
          mutations: {
            networkMode: 'offlineFirst',
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()],
      transformer: superjson,
    })
  );

  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcReact.Provider>
  );
}

export default TrpcReactQueryClientProvider;
