import { z } from 'zod';
import Store from 'electron-store';
import { router, publicProcedure } from '../configs/trpc';
import initializeUserData, { autoLaunch } from '../utils/initialize';

const store = new Store();

const settingsRouter = router({
  factoryReset: publicProcedure.mutation(async () => {
    store.delete('opened');
    store.delete('isAutoLaunchEnabled');
    store.delete('sortedSoftwareList');
    await initializeUserData();
  }),
  autoLaunch: publicProcedure.input(z.boolean()).mutation(async (opts) => {
    const { input: enabled } = opts;
    await autoLaunch(enabled);
  }),
  isAutoLaunchEnabled: publicProcedure
    .output(z.boolean().optional())
    .query(async () => {
      const isAutoLaunchEnabled = store.get('isAutoLaunchEnabled') as
        | boolean
        | undefined;

      return isAutoLaunchEnabled;
    }),
  processPlatform: publicProcedure
    .output(z.string().optional())
    .query(async () => {
      const processPlatform = store.get('processPlatform') as  // eslint-disable-next-line no-undef
        | NodeJS.Platform
        | undefined;

      return processPlatform;
    }),
});

export default settingsRouter;
