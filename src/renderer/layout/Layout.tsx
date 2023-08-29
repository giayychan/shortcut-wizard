import { ReactNode, useEffect } from 'react';
import { Flex, Paper } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import { useModals } from '@mantine/modals';

import TitleBar from './TitleBar';
import useAppHeightStore from '../stores/useAppHeightStore';
import trpcReact from '../utils/trpc';

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const mutation = trpcReact.appHeight.update.useMutation();
  const setHeight = useAppHeightStore((state) => state.setHeight);
  const { modals } = useModals();
  const isModalOpen = modals.length > 0;

  useEffect(() => {
    if (isModalOpen) return;
    setHeight(rect.height, { update: true }, mutation.mutate);
  }, [isModalOpen, mutation.mutate, rect.height, setHeight]);

  return (
    <Paper ref={ref}>
      <TitleBar />
      <Flex direction="column">{children}</Flex>
    </Paper>
  );
}

export default Layout;
