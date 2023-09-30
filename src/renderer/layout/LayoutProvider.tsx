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
        theme={{
          colorScheme: 'dark',
          primaryColor: 'indigo',
          components: {
            Button: {
              styles: () => ({
                root: {
                  borderRadius: 10,
                },
              }),
            },
          },
        }}
      >
        <ModalsProvider
          modals={modals}
          modalProps={{
            transitionProps: { duration: 500, transition: 'fade' },
            styles: {
              header: { padding: 0, margin: 0 },
              body: { padding: 0, margin: 0, height: '100%' },
            },
            fullScreen: true,
            keepMounted: false,
            closeOnEscape: false,
          }}
        >
          <Notifications position="top-right" top="2rem" />
          {children}
        </ModalsProvider>
      </MantineProvider>
    </TrpcReactQueryClientProvider>
  );
}

export default LayoutProvider;
