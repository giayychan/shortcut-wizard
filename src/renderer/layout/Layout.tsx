import { ReactNode, useEffect } from 'react';
import { Flex, Paper, LoadingOverlay } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';

import SignInPrompt from 'renderer/components/Auth/SignInPrompt';
import useUser from 'renderer/hooks/useUser';

import trpcReact from '../utils/trpc';
import useAppHeightStore from '../stores/useAppHeightStore';
import useGlobalLoadingStore from '../stores/useGlobalLoadingStore';

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const mutation = trpcReact.appHeight.update.useMutation();

  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(rect.height, { update: true }, mutation.mutate);
  }, [mutation.mutate, rect.height, setHeight]);

  const user = useUser();
  const visible = useGlobalLoadingStore((state) => state.visible);

  return (
    <Paper radius="md" ref={ref}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <Flex p="lg" direction="column">
        {!user ? <SignInPrompt isDisplayed={!user} /> : children}
      </Flex>
    </Paper>
  );
}

export default Layout;
