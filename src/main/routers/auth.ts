import isDev from 'electron-is-dev';
import { z } from 'zod';
import { User } from 'realm';

import { getRealmApp, signInRealm, signOut } from '../configs/realm';
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
      const realmApp = getRealmApp();
      if (!realmApp) throw Error('Realm app is not initialized');

      const url = new URL(
        `${SHORTCUT_WIZARD_HREF}/auth/sign-in?fromElectron=true`
      );

      if (isDev) {
        url.protocol = 'http';
        url.host = 'localhost:3000';
      }

      return { authUri: url.toString() };
    }),
  signInByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .output(z.custom<User>())
    .mutation(async (opts) => {
      const {
        input: { token },
      } = opts;
      try {
        const user = await signInRealm(token);
        return user;
      } catch (error: any) {
        console.log(error.message);
        throw Error('Sign in error');
      }
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

export const authCaller = authRouter.createCaller({});

export default authRouter;
