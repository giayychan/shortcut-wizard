import { ReactNode, useEffect } from 'react';
import { Flex, Paper, LoadingOverlay } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';

import SignInPrompt from 'renderer/components/Auth/SignInPrompt';
import useUser from 'renderer/hooks/useUser';
import useGlobalLoadingStore from '../stores/useGlobalLoadingStore';
import trpcReact from '../utils/trpc';
import useAppHeightStore from '../stores/useAppHeightStore';
import TitleBar from '../components/TitleBar';

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const mutation = trpcReact.appHeight.update.useMutation();

  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(rect.height, { update: true }, mutation.mutate);
  }, [mutation.mutate, rect.height, setHeight]);

  const visible = useGlobalLoadingStore((state) => state.visible);
  const user = useUser();

  return (
    <Paper radius="md" ref={ref}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <TitleBar />
      <Flex p="lg" direction="column">
        {!user ? <SignInPrompt isDisplayed={!user} /> : children}
      </Flex>
    </Paper>
  );
}

export default Layout;
