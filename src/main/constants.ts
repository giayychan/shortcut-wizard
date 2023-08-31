import { AddSoftwareAutocompleteOption } from '../../@types';

export const WIDTH = 720;
export const DEFAULT_HEIGHT = 186;
export const MAX_HEIGHT = 500;
export const SHORTCUT_WIZARD_HREF = 'https://shortcut-wizard.vercel.app';

export const APP_HOTKEYS = ['Shift', 'Space'];

export const AUTO_COMPLETE_CUSTOM_OPTION: AddSoftwareAutocompleteOption = {
  software: {
    key: '',
    icon: {
      isCustom: true,
      filename: '',
    },
  },
  shortcuts: [],
  value: '',
};
