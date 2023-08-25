import Store from 'electron-store';
import { router, publicProcedure } from '../configs/trpc';
import { initializeUserData } from '../utils';

const store = new Store();

const settingsRouter = router({
  factoryReset: publicProcedure.mutation(async () => {
    store.set('opened', false);
    await initializeUserData();
  }),
});

export default settingsRouter;
