import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Paper, Flex } from '@mantine/core';

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
      <SettingsProvider>
        <Layout>
          <AuthProvider>
            <Paper bg="dark.7" className="sticky z-10 top-[35px] p-2">
              <Paper bg="dark.7" className="border rounded border-[#373A40]">
                <Flex align="center">
                  <SearchShortcut />
                  <SettingsButton />
                </Flex>
                <SoftwareList />
              </Paper>
            </Paper>
            <ShortcutList />
          </AuthProvider>
        </Layout>
      </SettingsProvider>
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
