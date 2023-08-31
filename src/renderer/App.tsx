import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Paper, Tabs } from '@mantine/core';
import { IconScript, IconTableShortcut } from '@tabler/icons-react';
import { useState } from 'react';

import SearchShortcut from './components/SearchShortcut/Container';
import SoftwareList from './components/SoftwareList/Container';
import ShortcutList from './components/ShortcutList/Container';
import LayoutProvider from './layout/LayoutProvider';
import Layout from './layout/Layout';
import AuthProvider from './providers/AuthProvider';
import SettingsButton from './components/Settings/Button';
import SettingsProvider from './providers/SettingsProvider';
import TitleBar from './layout/TitleBar';
import TextEditor from './components/Script/TextEditor';

function MainWindow() {
  const [activeTab, setActiveTab] = useState<string | null>('shortcut');

  return (
    <LayoutProvider>
      <Layout>
        <AuthProvider>
          <SettingsProvider>
            <Paper className="sticky top-0 z-10">
              <TitleBar />
              <Tabs
                value={activeTab}
                onTabChange={setActiveTab}
                color="indigo"
                variant="outline"
                radius="md"
                defaultValue="shortcut"
              >
                <Tabs.List>
                  <Tabs.Tab
                    className="ml-2"
                    value="shortcut"
                    icon={<IconTableShortcut size="0.8rem" />}
                  >
                    Shortcut
                  </Tabs.Tab>
                  <Tabs.Tab value="script" icon={<IconScript size="0.8rem" />}>
                    Note
                  </Tabs.Tab>
                  <SettingsButton />
                </Tabs.List>
                <Tabs.Panel value="shortcut" className="p-2">
                  <div className="border rounded border-[#373A40]">
                    <SearchShortcut />
                    <SoftwareList />
                  </div>
                </Tabs.Panel>
              </Tabs>
            </Paper>
            {activeTab === 'shortcut' ? <ShortcutList /> : <TextEditor />}
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
