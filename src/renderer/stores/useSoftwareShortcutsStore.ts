import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { SoftwareShortcutsState } from '../../../@types';

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
        toast.error('Error fetchSoftwareShortcuts', error);
      }
    },

    addSoftware: async (newSoftware) => {
      const { softwareShortcuts } = get();
      try {
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
      } catch (error: any) {
        toast.error('Error fetchSoftwareShortcuts', error);
      }
    },

    removeSoftwares: async (removedSoftwares) => {
      const { softwareShortcuts } = get();

      removedSoftwares.forEach((software) => {
        delete softwareShortcuts[software];
      });

      try {
        await ipcRenderer.invoke('removeSoftwareShortcut', [removedSoftwares]);

        set({ softwareShortcuts: { ...softwareShortcuts } });
      } catch (error: any) {
        toast.error('Error fetchSoftwareShortcuts', error);
      }
    },
  }))
);

export default useSoftwareShortcutsStore;
