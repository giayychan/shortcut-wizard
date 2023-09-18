import isDev from 'electron-is-dev';
import { z } from 'zod';

import { router, publicProcedure } from '../configs/trpc';
import { SHORTCUT_WIZARD_HREF } from '../constants';
import { store } from '../utils';

const authRouter = router({
  getAuthUri: publicProcedure
    .input(z.enum(['sign-in', 'sign-up']))
    .output(
      z.object({
        authUri: z.string(),
        id: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input: authType } = opts;
      const machineId = store.get('machineId') as string | undefined;

      if (!machineId) throw new Error('Machine ID not found');

      const url = new URL(
        `${SHORTCUT_WIZARD_HREF}/auth/${authType}?electronId=${String(
          machineId
        )}`
      );

      if (isDev) {
        url.protocol = 'http';
        url.host = 'localhost:3000';
      }

      return { authUri: url.toString(), id: machineId };
    }),
});

export default authRouter;
