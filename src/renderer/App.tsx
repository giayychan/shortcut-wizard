import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Flex, MantineProvider, Paper } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useResizeObserver } from '@mantine/hooks';

// import BrandLogo from './components/common/BrandLogo';
// import SearchBar from './components/SearchBar/Container';
import SoftwareList from './components/SoftwareList/Container';
import useSoftwareShortcutsStore from './stores/useSoftwareShortcutsStore';

import './App.css';
import useAppHeightStore from './stores/useAppHeightStore';

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
    setHeight(rect.height);
  }, [rect.height, setHeight]);

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <Notifications />
      <Paper radius="md" ref={ref}>
        <Flex p="lg" direction="column">
          {/* <BrandLogo /> */}
          {/* <SearchBar /> */}
          <SoftwareList />
        </Flex>
      </Paper>
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
