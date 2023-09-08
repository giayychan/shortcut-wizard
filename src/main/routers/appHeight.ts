import { z } from 'zod';
import isDev from 'electron-is-dev';

import { router, publicProcedure } from '../configs/trpc';
import appWindow from '../mainWindow';
import { MAX_HEIGHT, WIDTH } from '../constants';
import { logInfo } from '../utils';

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

      if (!mainWindow || mainWindow.isMaximized() || !height) return;

      const isLargerThanMaxHeight = height > MAX_HEIGHT;

      mainWindow.setSize(
        WIDTH,
        isLargerThanMaxHeight ? MAX_HEIGHT : height,
        true
      );

      if (isDev) {
        logInfo(
          'height changed to: ',
          isLargerThanMaxHeight ? MAX_HEIGHT : height
        );
      }
    }),
});

export default appHeightRouter;
