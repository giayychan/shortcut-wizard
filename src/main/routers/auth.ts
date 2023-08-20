import isDev from 'electron-is-dev';
import { z } from 'zod';

import { signOut } from '../configs/realm';
import { router, publicProcedure } from '../configs/trpc';
import { SHORTCUT_WIZARD_HREF } from '../constants';

const authRouter = router({
  getAuthUri: publicProcedure
    .output(
      z.object({
        authUri: z.string(),
      })
    )
    .mutation(async () => {
      const url = new URL(
        `${SHORTCUT_WIZARD_HREF}/auth/sign-in?fromElectron=true`
      );

      if (isDev) {
        url.protocol = 'http';
        url.host = 'localhost:3000';
      }

      return { authUri: url.toString() };
    }),
  signOut: publicProcedure.mutation(async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.log(error.message);
      throw Error('Sign out error');
    }
  }),
});

export default authRouter;
