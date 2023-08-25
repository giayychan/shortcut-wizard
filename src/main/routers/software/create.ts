import { z } from 'zod';
import path from 'path';
import { copy, outputJson, readJson, readdir, remove } from 'fs-extra';

import { router, publicProcedure } from '../../configs/trpc';
import {
  SYS_SOFTWARE_SHORTCUTS_DIR,
  USER_SOFTWARE_SHORTCUTS_DIR,
  getIconFile,
  getUserDataPath,
  logError,
  logSuccess,
} from '../../utils';
import {
  AddSoftwareAutocompleteOption,
  SoftwareShortcut,
} from '../../../../@types';
import { AUTO_COMPLETE_CUSTOM_OPTION } from '../../constants';

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
    .output(z.custom<AddSoftwareAutocompleteOption[]>())
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
      z.custom<SoftwareShortcut>()
    )
    .mutation(async (opts) => {
      const data = opts.input;
      const { software, shortcuts } = data;

      const { icon, key } = software;

      if (!key) throw Error('softwareKey is required');

      if (!shortcuts) throw Error('shortcuts is required');

      const writeDse = getUserDataPath('shortcuts', `${key}.json`);

      const localIconPath = icon.filename;

      icon.filename = path.basename(icon.filename);

      try {
        const existingSoftwares = await readdir(USER_SOFTWARE_SHORTCUTS_DIR);

        const found = existingSoftwares.some((existedS) => {
          const [softwareKey] = existedS.split('.');
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
      } catch (error) {
        logError(`Couldn't add software - ${key}.json`, error);
        throw error;
      }
    }),
});

export default createSoftwareRouter;
