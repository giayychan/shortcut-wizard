import { useEffect } from 'react';
import { MAX_HEIGHT } from 'main/constants';
import useAppHeightStore from '../../stores/useAppHeightStore';

function useModalFormHeight() {
  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(MAX_HEIGHT);
    return () => {
      setHeight();
    };
  }, [setHeight]);

  return null;
}

export default useModalFormHeight;
