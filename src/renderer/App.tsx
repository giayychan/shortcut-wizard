import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Flex,
  MantineProvider,
  createEmotionCache,
  Paper,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useResizeObserver } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';

// import BrandLogo from './components/common/BrandLogo';
import SearchShortcut from './components/SearchShortcut/Container';
import SoftwareList from './components/SoftwareList/Container';
import useSoftwareShortcutsStore from './stores/useSoftwareShortcutsStore';

import './App.css';
import useAppHeightStore from './stores/useAppHeightStore';
import ShortcutList from './components/ShortcutList/Container';
import modals from './components/common/modals';

const myCache = createEmotionCache({ key: 'mantine' });

function Main() {
  const fetchSoftwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.fetchSoftwareShortcuts
  );

  useEffect(() => {
    fetchSoftwareShortcuts();
  }, [fetchSoftwareShortcuts]);

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
            {/* <BrandLogo /> */}
            <SearchShortcut />
            <SoftwareList />
            <ShortcutList />
          </Flex>
        </Paper>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
