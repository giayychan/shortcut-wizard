import { useEffect } from 'react';
import { MAX_HEIGHT } from 'main/constants';
import useAppHeightStore from '../stores/useAppHeightStore';

function useModalFormHeight() {
  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(MAX_HEIGHT, { update: false });

    return () => setHeight(undefined, { update: true });
  }, [setHeight]);

  return null;
}

export default useModalFormHeight;
