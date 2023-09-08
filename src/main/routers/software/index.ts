import { z } from 'zod';
import path from 'path';
import { exists, readJson, remove, statSync, writeJson } from 'fs-extra';

import { router, publicProcedure } from '../../configs/trpc';
import { logError, logSuccess } from '../../utils';
import { SoftwareShortcut } from '../../../../@types';
import createSoftwareRouter from './create';
import { getUserDataPath } from '../../utils/path';
import { getIconFile, writeCustomIconToDisk } from '../../utils/icon';
import { SoftwareSchema, AllSoftwaresSchema } from '../../schema/software';
import sortSoftwareRouter, { sortSoftwareCaller } from './sort';

const softwareRouter = router({
  byKey: publicProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .output(SoftwareSchema)
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
  all: publicProcedure.output(AllSoftwaresSchema).query(async () => {
    try {
      const files = await sortSoftwareCaller.get();

      const softwareShortcutsPromises = files.map(async (filename) => {
        const filePath = getUserDataPath('shortcuts', `${filename}.json`);
        const data: SoftwareShortcut = await readJson(filePath);
        const createdDate = statSync(filePath).birthtime.toISOString();

        const icon = await getIconFile(data.software.icon);
        data.software.icon = icon;
        return { ...data, createdDate };
      });

      const softwareShortcuts = await Promise.all(softwareShortcutsPromises);

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

      const sortedSoftwareList = await sortSoftwareCaller.get();
      const filteredSortedSoftwareList = sortedSoftwareList.filter(
        (software) => !softwareList.includes(software)
      );

      await sortSoftwareCaller.update(filteredSortedSoftwareList);

      logSuccess(`Removed softwares - ${softwareList.join(', ')}`);
    } catch (error) {
      logError(`Couldn't remove softwares`, error);
      throw error;
    }
  }),
  update: publicProcedure.input(SoftwareSchema).mutation(async (opts) => {
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
  sort: sortSoftwareRouter,
});

export const softwareCaller = softwareRouter.createCaller({});

export default softwareRouter;
