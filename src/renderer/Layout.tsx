import { ReactNode, useEffect } from 'react';
import {
  Flex,
  MantineProvider,
  createEmotionCache,
  Paper,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useResizeObserver } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';

import './App.css';
import useAppHeightStore from './stores/useAppHeightStore';
import modals from './components/common/modals';

const myCache = createEmotionCache({ key: 'mantine' });

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(rect.height, { update: true });
  }, [rect.height, setHeight]);

  return (
    <MantineProvider
      emotionCache={myCache}
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <ModalsProvider
        modals={modals}
        modalProps={{
          fullScreen: true,
          keepMounted: false,
          centered: true,
        }}
      >
        <Notifications />

        <Paper radius="md" ref={ref}>
          <Flex p="lg" direction="column">
            {children}
          </Flex>
        </Paper>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default Layout;
