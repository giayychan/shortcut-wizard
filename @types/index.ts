import { AutocompleteProps, SelectItemProps } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { modals } from '@mantine/modals';
import { User as FirebaseUser } from 'firebase/auth';
import Fuse from 'fuse.js';

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
  createdDate: string;
}

export interface SoftwareShortcuts {
  [key: string]: SoftwareShortcut;
}

export type FlattenShortcut = Shortcut & Omit<SoftwareShortcut, 'shortcuts'>;

export type AddSoftwareFormValues = Omit<SoftwareShortcut, 'createdDate'> & {
  file: File | null;
};
export type EditShortcutFormValues = Partial<Shortcut>;

export type RemoveShortcutFormValues = { shortcuts: string[] };
export type RemoveSoftwareFormValues = {
  removedSoftwares: string[];
};
export type SearchShortcutFormValues = {
  searchTerm: string;
};
export interface AddSoftwareAutocompleteOption
  extends Omit<SoftwareShortcut, 'createdDate'> {
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
  src?: string;
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

export type InvokeReturnTypes = {
  initiateLogin: string;
  factoryReset: void;
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
  initiateLogin: undefined;
  factoryReset: undefined;
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
    { update }: { update: boolean },
    callback: Function
  ) => void;
};

export type PlanType = 'basic' | 'efficient' | 'pro';
export type PlanInterval = 'monthly' | 'yearly';

export type User = FirebaseUser & {
  plan_type: PlanType;
  plan_interval: PlanInterval;
  stripe_id: string;
};

export type AuthState = {
  user: User | null;
  setUser: (user?: FirebaseUser | null) => void;
};

export type SelectedShortcutsState = {
  selectedSoftwareShortcut: SoftwareShortcut | null;
  setSelectedSoftwareShortcut: (
    softwareShortcut: SoftwareShortcut | null
  ) => void;
};

export type FuseSearchState = {
  results: Fuse.FuseResult<FlattenShortcut>[];
  setResults: (results: Fuse.FuseResult<FlattenShortcut>[]) => void;

  isSearchResultsShow: boolean;
  setShowSearchResults: (isShow: boolean) => void;

  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;

  toggleSearchResults: () => void;
  reset: () => void;
};

export type GlobalLoadingState = {
  visible: boolean;
  setVisible: (visible?: boolean) => void;
};
