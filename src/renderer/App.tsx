import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import SearchShortcut from './components/SearchShortcut/Container';
import SoftwareList from './components/SoftwareList/Container';
import ShortcutList from './components/ShortcutList/Container';
import LayoutProvider from './layout/LayoutProvider';
import Layout from './layout/Layout';
import useFetchSoftwareShortcuts from './hooks/useFetchSoftwareShortcuts';

function Main() {
  useFetchSoftwareShortcuts();

  return (
    <LayoutProvider>
      <Layout>
        <SearchShortcut />
        <SoftwareList />
        <ShortcutList />
      </Layout>
    </LayoutProvider>
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
