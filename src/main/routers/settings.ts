import { z } from 'zod';
import { router, publicProcedure } from '../configs/trpc';
import initializeUserData, { autoLaunch } from '../utils/initialize';
import { store } from '../utils';

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
  isPanelAlwaysAtCenter: publicProcedure
    .input(z.boolean())
    .mutation(async (opts) => {
      const { input: enabled } = opts;
      if (!enabled) {
        store.delete('isPanelAlwaysAtCenter');
        store.delete('panelPosition');
        return;
      }
      store.set('isPanelAlwaysAtCenter', enabled);
    }),
  processPlatform: publicProcedure
    .output(z.string().optional())
    .query(async () => {
      const processPlatform = store.get('processPlatform') as  // eslint-disable-next-line no-undef
        | NodeJS.Platform
        | undefined;

      return processPlatform;
    }),
  get: publicProcedure
    .output(
      z.object({
        sortSoftwareByRecentOpened: z.boolean().optional(),
        isAutoLaunchEnabled: z.boolean().optional(),
        isPanelAlwaysAtCenter: z.boolean().optional(),
      })
    )
    .query(async () => {
      const isAutoLaunchEnabled = store.get('isAutoLaunchEnabled') as
        | boolean
        | undefined;

      const sortSoftwareByRecentOpened = store.get(
        'sortSoftwareByRecentOpened'
      ) as boolean | undefined;

      const isPanelAlwaysAtCenter = store.get('isPanelAlwaysAtCenter') as
        | boolean
        | undefined;

      return {
        isAutoLaunchEnabled,
        sortSoftwareByRecentOpened,
        isPanelAlwaysAtCenter,
      };
    }),
});

export default settingsRouter;
