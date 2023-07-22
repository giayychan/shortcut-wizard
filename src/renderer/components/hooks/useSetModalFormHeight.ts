import { useEffect } from 'react';
import { MAX_HEIGHT } from 'main/constants';
import useAppHeightStore from '../../stores/useAppHeightStore';

function useModalFormHeight() {
  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(MAX_HEIGHT);
    console.log('useModalFormHeight: ', MAX_HEIGHT);
    return () => {
      setHeight();
      console.log('useModalFormHeight: ', 'return');
    };
  }, [setHeight]);

  return null;
}

export default useModalFormHeight;
