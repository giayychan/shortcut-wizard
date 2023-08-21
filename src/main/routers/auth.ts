import isDev from 'electron-is-dev';
import { z } from 'zod';

import { router, publicProcedure } from '../configs/trpc';
import { SHORTCUT_WIZARD_HREF } from '../constants';

const authRouter = router({
  getAuthUri: publicProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .output(
      z.object({
        authUri: z.string(),
      })
    )
    .mutation(async (opts) => {
      const {
        input: { uuid },
      } = opts;

      const url = new URL(
        `${SHORTCUT_WIZARD_HREF}/auth/sign-in?electronUuid=${uuid}`
      );

      if (isDev) {
        url.protocol = 'http';
        url.host = 'localhost:3000';
      }

      return { authUri: url.toString() };
    }),
});

export default authRouter;
