import { z } from 'zod';
import Store from 'electron-store';

import { router, publicProcedure } from '../configs/trpc';
import { DbUserData } from '../../../@types';

const store = new Store();

const userRouter = router({
  getPaidUser: publicProcedure
    .output(
      // todo: need to check data
      z.custom<DbUserData>().nullable()
    )
    .query(() => {
      const paidUser = store.get('paidUser') as DbUserData | undefined;

      return paidUser || null;
    }),
  updatePaidUser: publicProcedure
    .input(
      // todo: need to check data
      z.custom<DbUserData>().optional()
    )
    .mutation((opts) => {
      const { input: paidUser } = opts;

      if (paidUser?.stripePaymentId) {
        store.set('paidUser', paidUser);
      } else {
        store.delete('paidUser');
      }
    }),
});

export default userRouter;
