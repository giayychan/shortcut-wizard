import { z } from 'zod';
import { router, publicProcedure } from '../../configs/trpc';
import { logError, store } from '../../utils';

const sortSoftwareRouter = router({
  get: publicProcedure.output(z.array(z.string())).query(() => {
    try {
      const sortedList = store.get('sortedSoftwareList') as string[];
      return sortedList;
    } catch (error: any) {
      logError(`Couldn't get sorted software list: ${error}`);
      throw error;
    }
  }),
  update: publicProcedure
    .input(z.array(z.string()))
    .output(z.array(z.string()))
    .mutation((opts) => {
      try {
        store.set('sortedSoftwareList', opts.input);
        return opts.input;
      } catch (error: any) {
        logError(`Couldn't update sorted software list: ${error}`);
        throw error;
      }
    }),
  updateMostRecent: publicProcedure
    .input(z.string())
    .output(z.array(z.string()))
    .mutation(async (opts) => {
      try {
        const sortedList = store.get('sortedSoftwareList') as string[];
        const index = sortedList.findIndex((item) => item === opts.input);
        sortedList.splice(index, 1);

        sortedList.unshift(opts.input);
        store.set('sortedSoftwareList', sortedList);

        const newSorted = store.get('sortedSoftwareList') as string[];

        return newSorted;
      } catch (error: any) {
        logError(`Couldn't update sorted software list: ${error}`);
        throw error;
      }
    }),
});

export const sortSoftwareCaller = sortSoftwareRouter.createCaller({});

export default sortSoftwareRouter;
