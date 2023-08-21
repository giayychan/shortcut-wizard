import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SoftwareShortcutsState } from '../../../@types';
import useSelectedShortcutsStore from './useSelectedShortcutsStore';
import { notifyClientError } from '../utils';

const defaultState = {
  softwareShortcuts: {},
};

const { ipcRenderer } = window.electron;

const useSoftwareShortcutsStore = create(
  subscribeWithSelector<SoftwareShortcutsState>((set, get) => ({
    ...defaultState,

    fetchSoftwareShortcuts: async () => {
      try {
        const softwareShortcuts = await ipcRenderer.invoke(
          'fetchSoftwareShortcuts',
          undefined
        );

        set({ softwareShortcuts });
      } catch (error: any) {
        notifyClientError(`fetchSoftwareShortcuts: ${error.message}`);
      }
    },

    addSoftware: async (newSoftware) => {
      const { softwareShortcuts } = get();
      const res = await ipcRenderer.invoke('addSoftwareShortcut', [
        newSoftware,
      ]);

      set({
        softwareShortcuts: {
          ...softwareShortcuts,
          [newSoftware.software.key]: res,
        },
      });
    },

    removeSoftwares: async (removedSoftwares) => {
      const { softwareShortcuts } = get();

      const updated = { ...softwareShortcuts };

      removedSoftwares.forEach((software) => {
        delete updated[software];
      });

      await ipcRenderer.invoke('removeSoftwareShortcut', [removedSoftwares]);

      set({ softwareShortcuts: updated });
    },

    updateShortcutBySoftwareKey: async (updatedShortcut) => {
      const { softwareShortcuts } = get();
      const { selectedSoftwareShortcut, setSelectedSoftwareShortcut } =
        useSelectedShortcutsStore.getState();

      if (!selectedSoftwareShortcut) throw new Error('No softwareKey selected');

      const softwareKey = selectedSoftwareShortcut.software.key;
      const updatedShortcuts = softwareShortcuts[softwareKey].shortcuts.map(
        (shortcut) => {
          if (shortcut.id === updatedShortcut.id) return updatedShortcut;
          return shortcut;
        }
      );

      const softwareShortcut = await ipcRenderer.invoke(
        'updateShortcutsBySoftwareKey',
        [softwareKey, updatedShortcuts]
      );

      const updated = { ...softwareShortcuts };

      updated[softwareKey].shortcuts = updatedShortcuts;

      setSelectedSoftwareShortcut(softwareShortcut);
      set({ softwareShortcuts: updated });
    },

    addShortcutBySelectedSoftware: async (newShortcut) => {
      const { softwareShortcuts } = get();
      const { selectedSoftwareShortcut, setSelectedSoftwareShortcut } =
        useSelectedShortcutsStore.getState();

      if (!selectedSoftwareShortcut) throw new Error('No softwareKey selected');

      const softwareKey = selectedSoftwareShortcut.software.key;

      const softwareShortcut = await ipcRenderer.invoke(
        'addShortcutsBySoftwareKey',
        [softwareKey, [newShortcut]]
      );

      const updated = { ...softwareShortcuts };

      updated[softwareKey] = softwareShortcut;
      setSelectedSoftwareShortcut(softwareShortcut);
      set({ softwareShortcuts: updated });
    },

    removeShortcutsBySelectedSoftware: async (removedShortcuts) => {
      const { softwareShortcuts } = get();
      const { selectedSoftwareShortcut, setSelectedSoftwareShortcut } =
        useSelectedShortcutsStore.getState();

      if (!selectedSoftwareShortcut) throw new Error('No softwareKey selected');

      const softwareKey = selectedSoftwareShortcut.software.key;

      const softwareShortcut = await ipcRenderer.invoke(
        'removeShortcutsBySoftwareKey',
        [softwareKey, removedShortcuts]
      );

      const updated = { ...softwareShortcuts };

      updated[softwareKey] = softwareShortcut;
      setSelectedSoftwareShortcut(softwareShortcut);
      set({ softwareShortcuts: updated });
    },
  }))
);

export default useSoftwareShortcutsStore;
