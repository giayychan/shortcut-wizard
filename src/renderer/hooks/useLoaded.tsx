import { useEffect } from 'react';
import useGlobalLoadingStore from '../stores/useGlobalLoadingStore';

const { ipcRenderer } = window.electron;

function useLoaded() {
  const [visible, setVisible] = useGlobalLoadingStore((state) => [
    state.visible,
    state.setVisible,
  ]);

  useEffect(() => {
    ipcRenderer.on('loaded', (loaded) => {
      setVisible(!loaded);
    });
  }, [setVisible]);

  return visible;
}

export default useLoaded;
