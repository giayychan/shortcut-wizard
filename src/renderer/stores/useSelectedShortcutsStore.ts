import { create } from 'zustand';
import { SoftwareShortcut } from '../../../@types';
import useSoftwareShortcutsStore, {
  SoftwareShortcutsState,
} from './useSoftwareShortcutsStore';

export type SelectedShortcutsState = {
  selectedSoftwareShortcut: SoftwareShortcut | null;
  setSelectedSoftwareShortcut: (
    softwareShortcut: SoftwareShortcut | null
  ) => void;
};

const defaultSelectedShortcutsState = {
  selectedSoftwareShortcut: null,
};

useSoftwareShortcutsStore.subscribe(
  (
    selectedState: SoftwareShortcutsState,
    previousSelectedState: SoftwareShortcutsState
  ) => console.log(selectedState, previousSelectedState)
);

const useSelectedShortcutsStore = create<SelectedShortcutsState, []>((set) => ({
  ...defaultSelectedShortcutsState,
  setSelectedSoftwareShortcut: (softwareShortcut) => {
    set({ selectedSoftwareShortcut: softwareShortcut });
  },
}));

export default useSelectedShortcutsStore;
