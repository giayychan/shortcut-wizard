import { ReactNode, useEffect } from 'react';
import { Flex, Paper } from '@mantine/core';
import { useDebouncedState, useResizeObserver } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { MAX_HEIGHT } from 'main/constants';

import TitleBar from './TitleBar';
import trpcReact from '../utils/trpc';

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const { mutate } = trpcReact.appHeight.update.useMutation();

  const [height, setHeight] = useDebouncedState(rect.height, 100);

  const { modals } = useModals();
  const isModalOpen = modals.length > 0;

  useEffect(() => {
    if (isModalOpen) {
      setHeight(MAX_HEIGHT);
    } else setHeight(rect.height);
  }, [isModalOpen, setHeight, rect.height]);

  useEffect(() => {
    const roundedH = Math.round(height);
    mutate({ height: roundedH });
  }, [isModalOpen, mutate, height]);

  return (
    <Paper ref={ref}>
      <TitleBar />
      <Flex direction="column">{children}</Flex>
    </Paper>
  );
}

export default Layout;
