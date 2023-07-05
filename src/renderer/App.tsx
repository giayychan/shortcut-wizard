import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import BrandLogo from './components/common/BrandLogo';
import SearchBar from './components/SearchBar/Container';
import useSoftwareShortcutsStore from './stores/useSoftwareShortcutsStore';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function SoftwareShortcuts() {
  const fetchSoftwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.fetchSoftwareShortcuts
  );

  useEffect(() => {
    fetchSoftwareShortcuts();
  }, [fetchSoftwareShortcuts]);

  return (
    <>
      <SearchBar />
    </>
  );
}

function Main() {
  return (
    <>
      <BrandLogo />
      <SoftwareShortcuts />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
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
