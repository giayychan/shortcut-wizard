import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Tabs } from '@mantine/core';
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
import TextEditor from './components/Script/TextEditor';
import ShortcutListContainer from './components/ShortcutList/Container';

function TabsProvider({ children }: { children: ReactNode }) {
  return (
    <Tabs color="indigo" variant="outline" radius="md" defaultValue="shortcut">
      <Tabs.List>
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
              <Tabs.Panel value="shortcut" className="p-2">
                <div className="border rounded border-[#373A40]">
                  <SearchShortcut />
                  <SoftwareList />
                </div>
                <ShortcutList />
              </Tabs.Panel>
              <Tabs.Panel value="note">
                <TextEditor />
              </Tabs.Panel>
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
