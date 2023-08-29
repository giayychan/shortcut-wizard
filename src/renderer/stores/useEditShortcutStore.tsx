import { create } from 'zustand';
import { EditShortcutState } from '../../../@types';

const useEditShortcutStore = create<EditShortcutState>((set) => ({
  opened: false,
  shortcutId: '',
  softwareKey: '',
  setShortcutId: (shortcutId) => set({ shortcutId }),
  setOpened: (opened) => set({ opened }),
  setSoftwareKey: (softwareKey) => set({ softwareKey }),
}));

export default useEditShortcutStore;
