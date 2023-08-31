import { AutocompleteProps, SelectItemProps } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { modals } from '@mantine/modals';
import { User } from 'firebase/auth';
import Fuse from 'fuse.js';

declare module '@mantine/modals' {
  interface MantineModalsOverride {
    modals: typeof modals;
  }
}

type Hotkey = string[];
type Hotkeys = Hotkey[];

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

export type EditShortcutState = {
  opened: boolean;
  shortcutId: string;
  softwareKey: string;
  setShortcutId: (shortcutId: string) => void;
  setSoftwareKey: (key: string) => void;
  setOpened: (opened: boolean) => void;
};
export type EditScriptState = {
  content: string;
  setContent: (content: string) => void;
};

export type ConnectedState = {
  connected: boolean;
  loading: boolean;
  onConnected: () => void;
};

export type DbUserData = {
  electronId: string;
  plan: {
    type: string;
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
  setUserByFirebase: (user: User | null) => void;
  setUserByPaidUser: (user: DbUserData) => void;
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
