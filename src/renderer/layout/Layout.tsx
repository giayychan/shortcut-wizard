import { ReactNode, useEffect } from 'react';
import { Flex, Paper } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import useAppHeightStore from '../stores/useAppHeightStore';
import trpcReact from '../utils/trpc';
import TitleBar from './TitleBar';

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const mutation = trpcReact.appHeight.update.useMutation();
  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(rect.height, { update: true }, mutation.mutate);
  }, [mutation.mutate, rect.height, setHeight]);

  return (
    <Paper ref={ref}>
      <TitleBar />
      <Flex direction="column" p="md">
        {children}
      </Flex>
    </Paper>
  );
}

export default Layout;
