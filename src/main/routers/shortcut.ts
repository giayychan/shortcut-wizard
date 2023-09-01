import z from 'zod';
import { writeJson } from 'fs-extra';
import { logSuccess, logError } from '../utils';
import { router, publicProcedure } from '../configs/trpc';
import { softwareCaller } from './software';
import { getUserDataPath } from '../utils/path';
import { ShortcutSchema } from '../schema/software';
import aiSearchRouter from './search';

const ShortcutInputSchema = z.object({
  softwareKey: z.string(),
  shortcut: ShortcutSchema,
});

const shortcutRouter = router({
  ai: aiSearchRouter,
  create: publicProcedure.input(ShortcutInputSchema).mutation(async (opts) => {
    const { input } = opts;
    const { softwareKey: key, shortcut } = input;

    try {
      const softwareShortcut = await softwareCaller.byKey({ key });
      softwareShortcut.shortcuts = [...softwareShortcut.shortcuts, shortcut];

      const writeDse = getUserDataPath('shortcuts', `${key}.json`);

      await writeJson(writeDse, softwareShortcut);
      logSuccess(`Added user shortcuts - ${key}.json`);

      return softwareShortcut;
    } catch (error) {
      logError(`Couldn't add user shortcuts - ${key}.json`, error);
      throw error;
    }
  }),
  update: publicProcedure.input(ShortcutInputSchema).mutation(async (opts) => {
    const { input } = opts;
    const { softwareKey: key, shortcut } = input;
    try {
      const softwareShortcut = await softwareCaller.byKey({ key });
      const updateIndex = softwareShortcut.shortcuts.findIndex(
        (s) => s.id === shortcut.id
      );
      softwareShortcut.shortcuts[updateIndex] = shortcut;

      const writeDse = getUserDataPath('shortcuts', `${key}.json`);

      await writeJson(writeDse, softwareShortcut);
      logSuccess(`Update user shortcuts - ${key}.json`);

      return softwareShortcut;
    } catch (error) {
      logError(`Couldn't update user shortcuts - ${key}.json`, error);
      throw error;
    }
  }),
  delete: publicProcedure
    .input(
      z.object({
        softwareKey: z.string(),
        shortcuts: z.array(ShortcutSchema),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { softwareKey: key, shortcuts } = input;
      try {
        const softwareShortcut = await softwareCaller.byKey({ key });
        softwareShortcut.shortcuts = softwareShortcut.shortcuts.filter(
          (shortcut) => {
            const found = shortcuts.find((s) => s.id === shortcut.id);
            return !found;
          }
        );

        const writeDse = getUserDataPath('shortcuts', `${key}.json`);

        await writeJson(writeDse, softwareShortcut);
        logSuccess(`Removed user shortcuts - ${key}.json`);

        return softwareShortcut;
      } catch (error) {
        logError(`Couldn't remove user shortcuts - ${key}.json`, error);
        throw error;
      }
    }),
});

export default shortcutRouter;
