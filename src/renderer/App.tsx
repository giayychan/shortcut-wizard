import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import SearchShortcut from './components/SearchShortcut/Container';
import SoftwareList from './components/SoftwareList/Container';
import useSoftwareShortcutsStore from './stores/useSoftwareShortcutsStore';
import ShortcutList from './components/ShortcutList/Container';
import BrandLogo from './components/common/BrandLogo';
import Layout from './Layout';
import './App.css';

function Main() {
  const fetchSoftwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.fetchSoftwareShortcuts
  );

  useEffect(() => {
    fetchSoftwareShortcuts();
  }, [fetchSoftwareShortcuts]);

  return (
    <Layout>
      <SearchShortcut />
      <SoftwareList />
      <ShortcutList />
      <BrandLogo />
    </Layout>
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
