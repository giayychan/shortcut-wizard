import { z } from 'zod';
import { router, publicProcedure } from '../configs/trpc';
import appWindow from '../mainWindow';
import { WIDTH } from '../constants';

const appHeightRouter = router({
  update: publicProcedure
    .input(
      z.object({
        height: z.number(),
      })
    )
    .mutation((opts) => {
      const {
        input: { height },
      } = opts;

      const mainWindow = appWindow.getWindow();
      if (mainWindow) {
        mainWindow.setSize(WIDTH, height, true);
        console.log('height changed to', height);
      }
    }),
});

export default appHeightRouter;
