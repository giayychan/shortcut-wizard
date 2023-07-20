import { AutocompleteProps, SelectItemProps } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

export type Hotkey = string[];
export type Hotkeys = Hotkey[];

export interface Shortcut {
  id: string;
  description: string;
  hotkeys: Hotkeys;
  isFavorite: boolean;
}

export interface IconData {
  isCustom: boolean;
  filename: string;
  dataUri?: string;
}

export interface SoftwareShortcut {
  software: {
    key: string;
    icon: IconData;
  };
  shortcuts: Shortcut[];
}

export interface SoftwareShortcuts {
  [key: string]: SoftwareShortcut;
}

export type FlattenShortcut = Shortcut & Omit<SoftwareShortcut, 'shortcuts'>;

export type AddSoftwareFormValues = SoftwareShortcut & { file: File | null };

export interface AddSoftwareAutocompleteOption extends SoftwareShortcut {
  value: string;
}

export type AutoCompleteProps = {
  form: UseFormReturnType<AddSoftwareFormValues>;
  showNextInput: () => void;
  icon: AutocompleteProps['icon'];
};

export interface AddSoftwareAutocompleteItemProps
  extends SoftwareShortcut,
    SelectItemProps {}
