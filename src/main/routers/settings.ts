import { z } from 'zod';
import Store from 'electron-store';
import { router, publicProcedure } from '../configs/trpc';
import initializeUserData, { autoLaunch } from '../utils/initialize';

const store = new Store();

const settingsRouter = router({
  factoryReset: publicProcedure.mutation(async () => {
    store.delete('opened');
    await initializeUserData();
  }),
  autoLaunch: publicProcedure.input(z.boolean()).mutation(async (opts) => {
    const { input: enabled } = opts;
    await autoLaunch(enabled);
  }),
  sortSoftwareByRecentOpened: publicProcedure
    .input(z.boolean())
    .mutation(async (opts) => {
      const { input: enabled } = opts;
      store.set('sortSoftwareByRecentOpened', enabled);
    }),
  get: publicProcedure
    .output(
      z.object({
        sortSoftwareByRecentOpened: z.boolean().optional(),
        isAutoLaunchEnabled: z.boolean().optional(),
      })
    )
    .query(async () => {
      const isAutoLaunchEnabled = store.get('isAutoLaunchEnabled') as
        | boolean
        | undefined;

      const sortSoftwareByRecentOpened = store.get(
        'sortSoftwareByRecentOpened'
      ) as boolean | undefined;

      return { isAutoLaunchEnabled, sortSoftwareByRecentOpened };
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
