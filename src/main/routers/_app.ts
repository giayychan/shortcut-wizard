import { router } from '../configs/trpc';
import appHeightRouter from './appHeight';
import authRouter from './auth';
import softwareRouter from './software';

export const appRouter = router({
  appHeight: appHeightRouter,
  software: softwareRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
