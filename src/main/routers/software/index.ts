import { z } from 'zod';
import path from 'path';
import {
  exists,
  readJson,
  readdir,
  remove,
  statSync,
  writeJson,
} from 'fs-extra';

import { router, publicProcedure } from '../../configs/trpc';
import {
  USER_SOFTWARE_SHORTCUTS_DIR,
  getIconFile,
  getUserDataPath,
  logError,
  logSuccess,
  writeCustomIconToDisk,
} from '../../utils';
import { SoftwareShortcut, SoftwareShortcuts } from '../../../../@types';
import createSoftwareRouter from './create';

const softwareSchema = z.object({
  software: z.object({
    key: z.string(),
    icon: z.object({
      isCustom: z.boolean(),
      filename: z.string(),
      dataUri: z.string().optional(),
    }),
  }),
  shortcuts: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      hotkeys: z.array(z.array(z.string())),
      isFavorite: z.boolean(),
    })
  ),
  createdDate: z.string(),
});

const allSoftwaresSchema = z.record(z.string(), softwareSchema);

const softwareKeyListSchema = z.array(z.string());

const softwareRouter = router({
  byKey: publicProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .output(softwareSchema)
    .query(async (opts) => {
      const {
        input: { key },
      } = opts;

      const filePath = getUserDataPath('shortcuts', `${key}.json`);

      try {
        const result: SoftwareShortcut = await readJson(filePath);
        const iconWithDataUri = await getIconFile(result.software.icon);
        result.software.icon = iconWithDataUri;

        logSuccess(`fetched software shortcut - ${key}.json successfully`);

        return result;
      } catch (error: any) {
        logError(`Couldn't software byKey - ${key}.json: ${error}`);
        throw error;
      }
    }),
  keyList: publicProcedure.output(softwareKeyListSchema).query(async () => {
    try {
      const filenames = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);
      return filenames;
    } catch (error: any) {
      logError(`Couldn't software keyList: ${error}`);
      throw error;
    }
  }),
  all: publicProcedure.output(allSoftwaresSchema).query(async () => {
    try {
      const files = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);

      const softwareShortcuts: SoftwareShortcuts = {};

      await Promise.all(
        files.map(async (file) => {
          if (path.extname(file).toLowerCase() === '.json') {
            const filePath = getUserDataPath('shortcuts', file);
            const data: SoftwareShortcut = await readJson(filePath);
            const createdDate = statSync(filePath).birthtime.toISOString();

            const icon = await getIconFile(data.software.icon);
            data.software.icon = icon;
            softwareShortcuts[data.software.key] = { ...data, createdDate };
          }
        })
      );

      logSuccess('fetched software shortcuts successfully');

      return softwareShortcuts;
    } catch (error) {
      logError("Couldn't fetch all software shortcuts:", error);
      throw error;
    }
  }),
  create: createSoftwareRouter,
  delete: publicProcedure.input(z.array(z.string())).mutation(async (opts) => {
    const { input: softwareList } = opts;
    if (!softwareList.length) throw Error('software list is required');

    try {
      const promises = softwareList.map(async (software) => {
        const removePath = getUserDataPath('shortcuts', `${software}.json`);
        await remove(removePath);
      });

      await Promise.all(promises);
      logSuccess(`Removed softwares - ${softwareList.join(', ')}`);
    } catch (error) {
      logError(`Couldn't remove softwares`, error);
      throw error;
    }
  }),
  update: publicProcedure.input(softwareSchema).mutation(async (opts) => {
    const { input: data } = opts;
    const {
      software: { key, icon },
    } = data;

    const writeDse = getUserDataPath('shortcuts', `${key}.json`);
    const originalData: SoftwareShortcut = await readJson(writeDse);
    const localIconPath = icon.filename;

    icon.filename = path.basename(icon.filename);
    let desc = getUserDataPath('icons', icon.filename);

    try {
      if (icon.isCustom) {
        const iconExisted = await exists(desc);

        if (!iconExisted) {
          icon.filename = `${icon.filename.split('.')[0]}-${Date.now()}.${
            icon.filename.split('.')[1]
          }`;
          desc = getUserDataPath('icons', icon.filename);

          await writeCustomIconToDisk(localIconPath, desc, () =>
            remove(writeDse)
          );

          if (originalData.software.icon.isCustom) {
            const originalIconPath = getUserDataPath(
              'icons',
              originalData.software.icon.filename
            );
            await remove(originalIconPath);
          }
        }
      }

      await writeJson(writeDse, data);

      logSuccess(`Updated software - ${key}.json successfully`);
    } catch (error) {
      logError(`Couldn't update software`, error);
      throw error;
    }
  }),
});

export const softwareCaller = softwareRouter.createCaller({});

export default softwareRouter;
