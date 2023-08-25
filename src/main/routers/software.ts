import { z } from 'zod';
import path from 'path';
import { readJson, readdir, statSync } from 'fs-extra';

import { router, publicProcedure } from '../configs/trpc';
import { getAssetPath, getUserDataPath, logError, logSuccess } from '../utils';
import { getIconFile } from '../io';
import {
  AddSoftwareAutocompleteOption,
  SoftwareShortcut,
  SoftwareShortcuts,
} from '../../../@types';
import { AUTO_COMPLETE_CUSTOM_OPTION } from '../constants';

const USER_SOFTWARE_SHORTCUTS_DIR = getUserDataPath('shortcuts');
const USER_CUSTOM_ICONS_DIR = getUserDataPath('icons');
const USER_VECTOR_STORE_DIR = getUserDataPath('vector_store');
const SYS_SOFTWARE_SHORTCUTS_DIR = getAssetPath(
  'data',
  'shortcuts',
  process.platform
);

const SYS_SOFTWARES_ICONS_DIR = getAssetPath('icons', 'softwares');

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

export const createAutoCompleteOptions = async (desc: string) => {
  try {
    const filenames = await readdir(desc);

    const autoCompleteOptions: AddSoftwareAutocompleteOption[] =
      await Promise.all(
        filenames.map(async (filename) => {
          const [key] = filename.split('.');

          const json = await readJson(path.join(desc, filename));

          const icon = await getIconFile({
            isCustom: false,
            filename: json.software.icon.filename,
          });

          return {
            software: {
              ...json.software,
              icon,
            },
            shortcuts: [],
            value: key,
          };
        })
      );

    autoCompleteOptions.push(AUTO_COMPLETE_CUSTOM_OPTION);

    return autoCompleteOptions;
  } catch (error) {
    logError(`Couldn't create autocomplete options`, error);
    throw error;
  }
};

const createSoftwareRouter = router({
  options: publicProcedure.query(async () => {
    try {
      const autoCompleteOptions = await createAutoCompleteOptions(
        SYS_SOFTWARE_SHORTCUTS_DIR
      );
      const existingSoftwares = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);

      const filteredExistingSoftwaresAutoCompleteOptions =
        autoCompleteOptions.filter((option: AddSoftwareAutocompleteOption) => {
          const found = existingSoftwares.some((software) => {
            const [key] = software.split('.');
            return key === option.software.key;
          });

          return !found;
        });

      logSuccess(`fetchSoftwareAutoCompleteOptions - successfully`);
      return filteredExistingSoftwaresAutoCompleteOptions;
    } catch (error: any) {
      logError(`Couldn't fetchSoftwareAutoCompleteOptions: ${error}`);
      throw error;
    }
  }),
});

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
});

export default softwareRouter;
