import { create } from 'zustand';
import { SelectedShortcutsState } from '../../../@types';

const defaultSelectedShortcutsState = {
  selectedSoftwareShortcut: null,
};

const useSelectedShortcutsStore = create<SelectedShortcutsState, []>((set) => ({
  ...defaultSelectedShortcutsState,
  setSelectedSoftwareShortcut: (softwareShortcut) => {
    set({ selectedSoftwareShortcut: softwareShortcut });
  },
}));

export default useSelectedShortcutsStore;
