import { AddSoftwareAutocompleteOption } from '../../@types';

export const WIDTH = 680;
export const DEFAULT_HEIGHT = 167;
export const MAX_HEIGHT = 700;
export const SHORTCUT_WIZARD_HREF = 'https://shortcut-wizard.vercel.app';

export const APP_HOTKEYS = ['Shift', 'Command', 'Space'];

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
