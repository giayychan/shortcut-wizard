import { useEffect } from 'react';
import useSoftwareShortcutsStore from '../stores/useSoftwareShortcutsStore';

function useFetchSoftwareShortcuts() {
  const fetchSoftwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.fetchSoftwareShortcuts
  );

  useEffect(() => {
    fetchSoftwareShortcuts();
  }, [fetchSoftwareShortcuts]);

  return null;
}

export default useFetchSoftwareShortcuts;
