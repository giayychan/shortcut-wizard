import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { notifications } from '@mantine/notifications';
import { SoftwareShortcutsState } from '../../../@types';
import useSelectedShortcutsStore from './useSelectedShortcutsStore';

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
        notifications.show({
          message: `fetchSoftwareShortcuts: ${error.message}`,
          color: 'red',
        });
      }
    },

    addSoftware: async (newSoftware) => {
      const { softwareShortcuts } = get();
      const res = await ipcRenderer.invoke('addSoftwareShortcut', [
        newSoftware,
      ]);

      // todo: update state without flickering
      set({
        softwareShortcuts: {
          ...softwareShortcuts,
          [newSoftware.software.key]: res,
        },
      });
    },

    removeSoftwares: async (removedSoftwares) => {
      const { softwareShortcuts } = get();

      removedSoftwares.forEach((software) => {
        delete softwareShortcuts[software];
      });

      await ipcRenderer.invoke('removeSoftwareShortcut', [removedSoftwares]);

      set({ softwareShortcuts: { ...softwareShortcuts } });
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

      softwareShortcuts[softwareKey] = softwareShortcut;
      setSelectedSoftwareShortcut(softwareShortcut);
      set({ softwareShortcuts });
    },

    removeShortcutsBySelectedSoftware: async (removedShortcuts) => {},
  }))
);

export default useSoftwareShortcutsStore;
