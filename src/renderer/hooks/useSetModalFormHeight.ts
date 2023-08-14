import { useEffect } from 'react';
import { MAX_HEIGHT } from 'main/constants';
import trpcReact from '../utils/trpc';
import useAppHeightStore from '../stores/useAppHeightStore';

function useModalFormHeight() {
  const mutation = trpcReact.appHeight.update.useMutation();

  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(MAX_HEIGHT, { update: false }, mutation.mutate);

    return () => setHeight(undefined, { update: true }, mutation.mutate);
  }, [setHeight, mutation.mutate]);

  return mutation;
}

export default useModalFormHeight;
