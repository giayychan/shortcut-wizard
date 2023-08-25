import { AutocompleteProps, SelectItemProps } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { modals } from '@mantine/modals';
import { User } from 'firebase/auth';
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

  addShortcutBySelectedSoftware: (newShortcut: Shortcut) => Promise<void>;
  updateShortcutBySoftwareKey: (updatedShortcut: Shortcut) => Promise<void>;
  removeShortcutsBySelectedSoftware: (
    removedShortcuts: Shortcut[]
  ) => Promise<void>;
};

export type OnChannels = 'update-auth-state';

export type InvokeReturnTypes = {
  addShortcutsBySoftwareKey: SoftwareShortcut;
  updateShortcutsBySoftwareKey: SoftwareShortcut;
  removeShortcutsBySoftwareKey: SoftwareShortcut;
};

export type InvokeArgumentTypes = {
  addShortcutsBySoftwareKey: [softwareKey: string, shortcuts: Shortcut[]];
  updateShortcutsBySoftwareKey: [
    softwareKey: string,
    updatedShortcuts: Shortcut[]
  ];
  removeShortcutsBySoftwareKey: [softwareKey: string, shortcuts: Shortcut[]];
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

export type ConnectedState = {
  connected: boolean;
  loading: boolean;
  onConnected: () => void;
};

export type PlanType = 'basic' | 'efficient' | 'pro';
export type PlanInterval = 'monthly' | 'yearly';

export type DbUserData = {
  electronId: string;
  plan: {
    type: string;
    interval: string;
  };
  trial: {
    startDate: number | null;
    endDate: number | null;
  };
  stripePaymentId?: string;
};

export type AuthState = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: DbUserData | null;
  unsubscribeUserChanged: () => void;
  setUser: (user?: User | null) => void;
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
  loading: boolean;
  setLoading: (loading?: boolean) => void;
};
