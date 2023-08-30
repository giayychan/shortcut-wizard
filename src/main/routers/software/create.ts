import { z } from 'zod';
import path from 'path';
import { outputJson, readJson, readdir, remove } from 'fs-extra';

import { router, publicProcedure } from '../../configs/trpc';
import { logError, logSuccess } from '../../utils';
import { AddSoftwareAutocompleteOption } from '../../../../@types';
import { AUTO_COMPLETE_CUSTOM_OPTION } from '../../constants';
import { getIconFile, writeCustomIconToDisk } from '../../utils/icon';
import {
  SYS_SOFTWARE_SHORTCUTS_DIR,
  USER_SOFTWARE_SHORTCUTS_DIR,
  getUserDataPath,
} from '../../utils/path';
import { SoftwareSchema } from '../../schema/software';
import { sortSoftwareCaller } from './sort';

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
            shortcuts: json.shortcuts,
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

const autoCompleteSchema = SoftwareSchema.omit({ createdDate: true });

const createSoftwareRouter = router({
  options: publicProcedure
    .output(
      z.array(
        autoCompleteSchema.extend({
          value: z.string(),
        })
      )
    )
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
  software: publicProcedure.input(SoftwareSchema).mutation(async (opts) => {
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

      let desc = getUserDataPath('icons', icon.filename);

      if (icon.isCustom) {
        icon.filename = `${icon.filename.split('.')[0]}-${Date.now()}.${
          icon.filename.split('.')[1]
        }`;

        desc = getUserDataPath('icons', icon.filename);

        await writeCustomIconToDisk(localIconPath, desc, () =>
          remove(writeDse)
        );
      }

      await outputJson(writeDse, data);

      const sortedSoftwareList = await sortSoftwareCaller.get();
      sortedSoftwareList.push(key);
      await sortSoftwareCaller.update(sortedSoftwareList);

      logSuccess(`Added software - ${key}.json`);
    } catch (error) {
      logError(`Couldn't add software - ${key}.json`, error);
      throw error;
    }
  }),
});

export default createSoftwareRouter;
