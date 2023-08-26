import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Flex } from '@mantine/core';

import SearchShortcut from './components/SearchShortcut/Container';
import SoftwareList from './components/SoftwareList/Container';
import ShortcutList from './components/ShortcutList/Container';
import LayoutProvider from './layout/LayoutProvider';
import Layout from './layout/Layout';
import AuthProvider from './providers/AuthProvider';
import SettingsButton from './components/Settings/Button';
import SettingsProvider from './providers/SettingsProvider';

function MainWindow() {
  return (
    <LayoutProvider>
      <Layout>
        <AuthProvider>
          <SettingsProvider>
            <Flex align="center" m="md">
              <SearchShortcut />
              <SettingsButton />
            </Flex>
            <SoftwareList />
            <ShortcutList />
          </SettingsProvider>
        </AuthProvider>
      </Layout>
    </LayoutProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainWindow />} />
      </Routes>
    </Router>
  );
}
