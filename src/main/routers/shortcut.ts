import z from 'zod';
import { writeJson } from 'fs-extra';
import { shortcutValidation } from '../schema';
import { getUserDataPath, logSuccess, logError } from '../utils';
import { router, publicProcedure } from '../configs/trpc';
import { Shortcut } from '../../../@types';
import { softwareCaller } from './software';

const shortcutInputSchema = z.object({
  softwareKey: z.string(),
  // todo: check this type
  shortcut: z.custom<Shortcut>(),
});

const shortcutRouter = router({
  create: publicProcedure.input(shortcutInputSchema).mutation(async (opts) => {
    const { input } = opts;
    const { softwareKey: key, shortcut } = input;

    try {
      const softwareShortcut = await softwareCaller.byKey({ key });
      softwareShortcut.shortcuts = [...softwareShortcut.shortcuts, shortcut];

      const writeDse = getUserDataPath('shortcuts', `${key}.json`);

      await shortcutValidation(softwareShortcut);

      await writeJson(writeDse, softwareShortcut);
      logSuccess(`Added user shortcuts - ${key}.json`);

      return softwareShortcut;
    } catch (error) {
      logError(`Couldn't add user shortcuts - ${key}.json`, error);
      throw error;
    }
  }),
  update: publicProcedure.input(shortcutInputSchema).mutation(async (opts) => {
    const { input } = opts;
    const { softwareKey: key, shortcut } = input;
    try {
      const softwareShortcut = await softwareCaller.byKey({ key });
      const updateIndex = softwareShortcut.shortcuts.findIndex(
        (s) => s.id === shortcut.id
      );
      softwareShortcut.shortcuts[updateIndex] = shortcut;

      const writeDse = getUserDataPath('shortcuts', `${key}.json`);

      await shortcutValidation(softwareShortcut);

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
        // todo: check this type
        shortcuts: z.custom<Shortcut[]>(),
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
