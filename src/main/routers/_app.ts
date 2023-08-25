import { router } from '../configs/trpc';
import appHeightRouter from './appHeight';
import authRouter from './auth';
import softwareRouter from './software';
import settingsRouter from './settings';

export const appRouter = router({
  appHeight: appHeightRouter,
  software: softwareRouter,
  auth: authRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
