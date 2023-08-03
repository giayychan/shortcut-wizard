import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import SearchShortcut from './components/SearchShortcut/Container';
import SoftwareList from './components/SoftwareList/Container';
import ShortcutList from './components/ShortcutList/Container';
import BrandLogo from './components/common/BrandLogo';
import Layout from './Layout';
import './App.css';
import useUser from './hooks/useUser';
import useFetchSoftwareShortcuts from './hooks/useFetchSoftwareShortcuts';

function Main() {
  useUser();
  useFetchSoftwareShortcuts();

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
