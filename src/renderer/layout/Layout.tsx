import { ReactNode, useEffect } from 'react';
import { Flex, Paper, Text, Image } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import useAppHeightStore from '../stores/useAppHeightStore';
import trpcReact from '../utils/trpc';
import StatusBar from '../components/StatusBar/Container';
import LOGO from '../../../assets/borderlesslogo.png';

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const mutation = trpcReact.appHeight.update.useMutation();
  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(rect.height, { update: true }, mutation.mutate);
  }, [mutation.mutate, rect.height, setHeight]);

  return (
    <Paper ref={ref}>
      <Flex
        bg="dark.6"
        justify="center"
        align="center"
        h={35}
        className="titlebar"
        gap={10}
      >
        <Flex justify="center">
          <Image maw={20} src={LOGO} alt="Brand logo" pt={3} mr={8} />
          <Text size={15} fw={700}>
            Shortcut Wizard
          </Text>
        </Flex>
        <StatusBar />
      </Flex>
      <Flex direction="column" p="md">
        {children}
      </Flex>
    </Paper>
  );
}

export default Layout;
