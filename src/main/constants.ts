import { v4 } from 'uuid';
import { AddSoftwareAutocompleteOption } from '../../@types';

export const WIDTH = 720;
export const DEFAULT_HEIGHT = 145;
export const MAX_HEIGHT = 640;
export const SHORTCUT_WIZARD_HREF = 'https://shortcutwizard.app';

export const APP_HOTKEYS = ['Shift', 'Space'];

export const AUTO_COMPLETE_CUSTOM_OPTION: AddSoftwareAutocompleteOption = {
  software: {
    id: v4(),
    label: '',
    key: '',
    icon: {
      isCustom: true,
      filename: '',
    },
  },
  shortcuts: [],
  value: '',
};
