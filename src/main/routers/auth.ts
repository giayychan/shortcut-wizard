import isDev from 'electron-is-dev';
import { z } from 'zod';
import Store from 'electron-store';

import { router, publicProcedure } from '../configs/trpc';
import { SHORTCUT_WIZARD_HREF } from '../constants';

const store = new Store();

const authRouter = router({
  getAuthUri: publicProcedure
    .output(
      z.object({
        authUri: z.string(),
        id: z.string(),
      })
    )
    .mutation(async () => {
      const machineId = await store.get('machineId');
      const id = String(machineId);

      if (!id) throw new Error('Machine ID not found');

      const url = new URL(
        `${SHORTCUT_WIZARD_HREF}/auth/sign-in?electronId=${id}`
      );

      if (isDev) {
        url.protocol = 'http';
        url.host = 'localhost:3000';
      }

      return { authUri: url.toString(), id };
    }),
});

export default authRouter;
