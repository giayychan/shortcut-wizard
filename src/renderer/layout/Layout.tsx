import { ReactNode, useEffect } from 'react';
import { Flex, Paper, Text } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import useAppHeightStore from '../stores/useAppHeightStore';
import trpcReact from '../utils/trpc';
import StatusBar from '../components/StatusBar/Container';

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const mutation = trpcReact.appHeight.update.useMutation();
  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(rect.height, { update: true }, mutation.mutate);
  }, [mutation.mutate, rect.height, setHeight]);

  return (
    <Paper ref={ref}>
      <Flex bg="dark" justify="center" h={45} className="titlebar">
        <Text size={14} bg="red">
          Shortcut Wizard
        </Text>
        {/* <StatusBar /> */}
      </Flex>
      <Flex direction="column" p="lg">
        {children}
      </Flex>
    </Paper>
  );
}

export default Layout;
