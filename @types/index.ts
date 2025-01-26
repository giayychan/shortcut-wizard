import { AutocompleteProps, SelectItemProps } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { User } from 'firebase/auth';
import Fuse from 'fuse.js';

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
    id: string;
    key: string;
    label: string;
    icon: IconData;
  };
  shortcuts: Shortcut[];
  createdDate: string;
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

export type ConnectedState = {
  connected: boolean;
  loading: boolean;
  onConnected: () => void;
};

export type DbUserData = {
  email: string;
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
  user: (DbUserData & User) | null | undefined;
  setUser: (user: User | null) => void;
  setDbUser: (user: DbUserData | null) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;
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

export type TabType =
  | 'Account'
  | 'System'
  | 'Add Software'
  | 'Edit Software'
  | 'Sort Software'
  | 'Add Shortcut'
  | 'Edit Shortcut'
  | 'Feedback';
