import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Flex } from '@mantine/core';

import SearchShortcut from './components/SearchShortcut/Container';
import SoftwareList from './components/SoftwareList/Container';
import ShortcutList from './components/ShortcutList/Container';
import BrandLogo from './components/common/BrandLogo';
import LayoutProvider from './layout/LayoutProvider';
import useUser from './hooks/useUser';
import SignInPrompt from './components/Auth/SignInPrompt';
import Layout from './layout/Layout';
import useFetchSoftwareShortcuts from './hooks/useFetchSoftwareShortcuts';

function Main() {
  const user = useUser();
  useFetchSoftwareShortcuts();

  return (
    <LayoutProvider>
      <Layout>
        <SearchShortcut />
        <SoftwareList />
        <ShortcutList />
        <Flex>
          <SignInPrompt isDisplayed={!user} />
          <BrandLogo />
        </Flex>
      </Layout>
    </LayoutProvider>
  );
}

export default function sApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
