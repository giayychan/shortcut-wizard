import { ReactNode, useEffect } from 'react';
import dayjs from 'dayjs';
import { Flex, Paper, LoadingOverlay } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';

import SignInPrompt from '../components/Auth/SignInPrompt';
import TrialEndPrompt from '../components/TrialEndPrompt/Container';
import useGlobalLoadingStore from '../stores/useGlobalLoadingStore';
import useAppHeightStore from '../stores/useAppHeightStore';
import useUser from '../hooks/useUser';
import trpcReact from '../utils/trpc';

function Layout({ children }: { children: ReactNode }) {
  const [ref, rect] = useResizeObserver();

  const mutation = trpcReact.appHeight.update.useMutation();

  const setHeight = useAppHeightStore((state) => state.setHeight);

  useEffect(() => {
    setHeight(rect.height, { update: true }, mutation.mutate);
  }, [mutation.mutate, rect.height, setHeight]);

  const user = useUser();
  const visible = useGlobalLoadingStore((state) => state.loading);

  const renderChildren =
    user?.trial.endDate &&
    dayjs(user?.trial.endDate).toDate() < dayjs().toDate() ? (
      <TrialEndPrompt />
    ) : (
      children
    );

  return (
    <Paper radius="md" ref={ref}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <Flex p="lg" direction="column">
        {!user ? <SignInPrompt isDisplayed={!user} /> : renderChildren}
      </Flex>
    </Paper>
  );
}

export default Layout;
