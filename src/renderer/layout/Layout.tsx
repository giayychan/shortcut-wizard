import { ReactNode, useEffect } from 'react';
import { Flex } from '@mantine/core';
import { useDebouncedState, useResizeObserver } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { MAX_HEIGHT } from 'main/constants';

import trpcReact from '../utils/trpc';
import TitleBar from './TitleBar';

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
    <Flex direction="column" ref={ref}>
      <TitleBar />
      {children}
    </Flex>
  );
}

export default Layout;
