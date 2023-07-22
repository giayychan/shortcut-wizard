import { AutocompleteProps, SelectItemProps } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { modals } from '@mantine/modals';

declare module '@mantine/modals' {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

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
export type AddShortcutFormValues = Shortcut;

export type RemoveShortcutFormValues = { shortcuts: string[] };
export type RemoveSoftwareFormValues = {
  removedSoftwares: string[];
};
export type SearchShortcutFormValues = {
  searchTerm: string;
};
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

export type UploadCustomIconProps = {
  active: boolean;
  form: UseFormReturnType<AddSoftwareFormValues>;
};

export type StyledSvgProps = {
  className?: string;
  src: string;
};

export type SoftwareShortcutsState = {
  softwareShortcuts: SoftwareShortcuts;
  fetchSoftwareShortcuts: () => Promise<void>;

  addSoftware: (newSoftware: SoftwareShortcut) => Promise<void>;
  removeSoftwares: (removedSoftwares: string[]) => Promise<void>;

  addShortcutBySelectedSoftware: (newShortcut: Shortcut) => Promise<void>;
  updateShortcutBySoftwareKey: (updatedShortcut: Shortcut) => Promise<void>;
  removeShortcutsBySelectedSoftware: (
    removedShortcuts: Shortcut[]
  ) => Promise<void>;
};

export type OnArgumentTypes = {
  updateMainWindowHeight: [height: number];
};

export type OnChannels = keyof OnArgumentTypes;

export type InvokeReturnTypes = {
  fetchSoftwareShortcuts: SoftwareShortcuts;
  fetchSoftwareShortcut: SoftwareShortcut;
  fetchSoftwareAutoCompleteOptions: AddSoftwareAutocompleteOption[];
  addShortcutsBySoftwareKey: SoftwareShortcut;
  updateShortcutsBySoftwareKey: SoftwareShortcut;
  removeShortcutsBySoftwareKey: SoftwareShortcut;
  addSoftwareShortcut: SoftwareShortcut;
  removeSoftwareShortcut: void;
};

export type InvokeArgumentTypes = {
  fetchSoftwareShortcuts: undefined;
  fetchSoftwareAutoCompleteOptions: undefined;
  fetchSoftwareShortcut: [softwareKey: string];
  addShortcutsBySoftwareKey: [softwareKey: string, shortcuts: Shortcut[]];
  updateShortcutsBySoftwareKey: [
    softwareKey: string,
    updatedShortcuts: Shortcut[]
  ];
  removeShortcutsBySoftwareKey: [softwareKey: string, shortcuts: Shortcut[]];
  addSoftwareShortcut: [data: SoftwareShortcut];
  removeSoftwareShortcut: [softwareList: string[]];
};

export type InvokeChannels = keyof InvokeReturnTypes;

export type AppHeightState = {
  height: number;
  setHeight: (
    height: number | undefined,
    { update }: { update: boolean }
  ) => void;
};

export type SelectedShortcutsState = {
  selectedSoftwareShortcut: SoftwareShortcut | null;
  setSelectedSoftwareShortcut: (
    softwareShortcut: SoftwareShortcut | null
  ) => void;
};
