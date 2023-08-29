import { ReactNode } from 'react';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import '../App.css';
import modals from '../components/common/modals';
import TrpcReactQueryClientProvider from '../providers/TrpcReactQueryClientProvider';

const myCache = createEmotionCache({ key: 'mantine' });

function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <TrpcReactQueryClientProvider>
      <MantineProvider
        emotionCache={myCache}
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: 'dark' }}
      >
        <ModalsProvider
          modals={modals}
          modalProps={{
            styles: {
              header: { padding: 0, margin: 0 },
              body: { padding: 0, margin: 0 },
            },
            fullScreen: true,
            keepMounted: false,
          }}
        >
          <Notifications />
          {children}
        </ModalsProvider>
      </MantineProvider>
    </TrpcReactQueryClientProvider>
  );
}

export default LayoutProvider;
