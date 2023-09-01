import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Tabs, Paper } from '@mantine/core';
import { IconScript, IconTableShortcut } from '@tabler/icons-react';
import { ReactNode } from 'react';

import SearchShortcut from './components/SearchShortcut/Container';
import SoftwareList from './components/SoftwareList/Container';
import ShortcutList from './components/ShortcutList/Container';
import LayoutProvider from './layout/LayoutProvider';
import Layout from './layout/Layout';
import AuthProvider from './providers/AuthProvider';
import SettingsButton from './components/Settings/Button';
import SettingsProvider from './providers/SettingsProvider';

function TabsProvider({ children }: { children: ReactNode }) {
  return (
    <Tabs color="indigo" variant="outline" radius="md" defaultValue="shortcut">
      <Tabs.List className="sticky z-10 top-[35px]" bg="dark.7">
        <Tabs.Tab
          className="ml-2"
          value="shortcut"
          icon={<IconTableShortcut size="0.8rem" />}
        >
          Shortcut
        </Tabs.Tab>
        <Tabs.Tab value="note" icon={<IconScript size="0.8rem" />}>
          Note
        </Tabs.Tab>
        <SettingsButton />
      </Tabs.List>
      {children}
    </Tabs>
  );
}

function MainWindow() {
  return (
    <LayoutProvider>
      <AuthProvider>
        <SettingsProvider>
          <Layout>
            <TabsProvider>
              <Tabs.Panel value="shortcut" bg="dark.7">
                <Paper bg="dark.7" className="sticky z-10 top-[71px]  p-2">
                  <Paper
                    bg="dark.7"
                    className="border rounded border-[#373A40]"
                  >
                    <SearchShortcut />
                    <SoftwareList />
                  </Paper>
                </Paper>
                <ShortcutList />
              </Tabs.Panel>
              <Tabs.Panel value="note">{/* <TextEditor /> */}</Tabs.Panel>
            </TabsProvider>
          </Layout>
        </SettingsProvider>
      </AuthProvider>
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
