import { AddSoftwareAutocompleteOption } from '../../@types';

export const WIDTH = 680;
export const MAX_HEIGHT = 480;

export const BASIC_SOFTWARE_LIMIT = 5;
export const BASIC_SHORTCUT_LIMIT = 10;

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
