import { z } from 'zod';

import { router, publicProcedure } from '../configs/trpc';
import { DbUserData } from '../../../@types';
import { userSchema } from '../schema/user';
import { store } from '../utils';

const userRouter = router({
  getPaidUser: publicProcedure
    .output(z.custom<DbUserData>().nullable())
    .query(() => {
      const paidUser = store.get('paidUser') as DbUserData | undefined;

      return paidUser || null;
    }),
  updatePaidUser: publicProcedure
    .input(userSchema.optional())
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
