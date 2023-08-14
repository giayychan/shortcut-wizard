import { router } from '../configs/trpc';
import appHeightRouter from './appHeight';
import softwareRouter from './software';

export const appRouter = router({
  appHeight: appHeightRouter,
  software: softwareRouter,
});

export type AppRouter = typeof appRouter;
