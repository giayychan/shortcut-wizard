import { z } from 'zod';
import path from 'path';
import {
  copy,
  outputJson,
  readFile,
  readJson,
  readdir,
  remove,
  statSync,
} from 'fs-extra';

import { router, publicProcedure } from '../configs/trpc';
import {
  createDataUri,
  getAssetPath,
  getUserDataPath,
  logError,
  logSuccess,
} from '../utils';
import {
  AddSoftwareAutocompleteOption,
  IconData,
  SoftwareShortcut,
  SoftwareShortcuts,
} from '../../../@types';
import { AUTO_COMPLETE_CUSTOM_OPTION } from '../constants';

const USER_SOFTWARE_SHORTCUTS_DIR = getUserDataPath('shortcuts');
const USER_CUSTOM_ICONS_DIR = getUserDataPath('icons');
// const USER_VECTOR_STORE_DIR = getUserDataPath('vector_store');
const SYS_SOFTWARE_SHORTCUTS_DIR = getAssetPath(
  'data',
  'shortcuts',
  process.platform
);

const SYS_SOFTWARES_ICONS_DIR = getAssetPath('icons', 'softwares');

const getIconFile = async (icon: IconData) => {
  const { filename, isCustom } = icon;

  const srcDir = isCustom ? USER_CUSTOM_ICONS_DIR : SYS_SOFTWARES_ICONS_DIR;
  const userIconPath = `${srcDir}/${filename}`;

  try {
    const res = await readFile(userIconPath, {
      encoding: 'utf8',
    });

    const dataUri = createDataUri(res);
    // logSuccess(`Got ${isCustom ? 'user' : 'system'} ${filename} icons `);

    return { ...icon, dataUri };
  } catch (error) {
    logError(`Couldn't get user icons - ${userIconPath}`, error);
    throw error;
  }
};

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

const createAutoCompleteOptions = async (desc: string) => {
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

const writeCustomIconToDisk = async (
  src: string,
  desc: string,
  errorCallback?: () => Promise<void>
) => {
  try {
    await copy(src, desc);
    logSuccess(`Copied custom icon to ${desc}`);
  } catch (error: any) {
    logError(`Couldn't write custom icon to ${desc} - ${error.message}`);
    if (errorCallback) await errorCallback();
    throw error;
  }
};

const createSoftwareRouter = router({
  options: publicProcedure
    // todo: check data
    .output(z.promise(z.custom<AddSoftwareAutocompleteOption[]>()))
    .query(async () => {
      try {
        const autoCompleteOptions = await createAutoCompleteOptions(
          SYS_SOFTWARE_SHORTCUTS_DIR
        );
        const existingSoftwares = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);

        const filteredExistingSoftwaresAutoCompleteOptions =
          autoCompleteOptions.filter(
            (option: AddSoftwareAutocompleteOption) => {
              const found = existingSoftwares.some((software) => {
                const [key] = software.split('.');
                return key === option.software.key;
              });

              return !found;
            }
          );

        logSuccess(`fetchSoftwareAutoCompleteOptions - successfully`);
        return filteredExistingSoftwaresAutoCompleteOptions;
      } catch (error: any) {
        logError(`Couldn't fetchSoftwareAutoCompleteOptions: ${error}`);
        throw error;
      }
    }),
  software: publicProcedure
    .input(
      // todo: check data
      z.object({
        data: z.custom<SoftwareShortcut>(),
      })
    )
    .mutation(async (opts) => {
      const { data } = opts.input;
      const { icon, key } = data.software;

      if (!key) throw Error('softwareKey is required');

      if (!data.shortcuts) throw Error('shortcuts is required');

      const writeDse = getUserDataPath('shortcuts', `${key}.json`);

      const localIconPath = icon.filename;

      icon.filename = path.basename(icon.filename);

      try {
        const existingSoftwares = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);

        const found = existingSoftwares.some((software) => {
          const [softwareKey] = software.split('.');
          return softwareKey.toLowerCase() === key.toLowerCase();
        });

        if (found) throw Error('software already exists');

        await outputJson(writeDse, data);
        if (icon.isCustom) {
          const desc = getUserDataPath('icons', icon.filename);
          await writeCustomIconToDisk(localIconPath, desc, () =>
            remove(writeDse)
          );
        }
        logSuccess(`Added software - ${key}.json`);
        const iconWithDataUri = await getIconFile(icon);
        data.software.icon = iconWithDataUri;

        return data;
      } catch (error) {
        logError(`Couldn't add software - ${key}.json`, error);
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
