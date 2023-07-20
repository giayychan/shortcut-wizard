import { create } from 'zustand';
import {
  SelectedShortcutsState,
  SoftwareShortcutsState,
} from '../../../@types';
import useSoftwareShortcutsStore from './useSoftwareShortcutsStore';

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
