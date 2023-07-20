// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import type {
  Shortcut,
  SoftwareShortcut,
  SoftwareShortcuts,
  AddSoftwareAutocompleteOption,
} from '../../@types';

export type OnArgumentTypes = {
  updateMainWindowHeight: [height: number];
};

export type OnChannels = keyof OnArgumentTypes;

export type InvokeReturnTypes = {
  fetchSoftwareShortcuts: SoftwareShortcuts;
  fetchSoftwareShortcut: SoftwareShortcut;
  fetchSoftwareAutoCompleteOptions: AddSoftwareAutocompleteOption[];
  addShortcutsBySoftwareKey: void;
  removeShortcutsBySoftwareKey: void;
  addSoftwareShortcut: SoftwareShortcut;
  removeSoftwareShortcut: void;
};

export type InvokeArgumentTypes = {
  fetchSoftwareShortcuts: undefined;
  fetchSoftwareAutoCompleteOptions: undefined;
  fetchSoftwareShortcut: [softwareKey: string];
  addShortcutsBySoftwareKey: [softwareKey: string, shortcuts: Shortcut[]];
  removeShortcutsBySoftwareKey: [softwareKey: string, shortcuts: Shortcut[]];
  addSoftwareShortcut: [data: SoftwareShortcut];
  removeSoftwareShortcut: [softwareList: string[]];
};

export type InvokeChannels = keyof InvokeReturnTypes;

const electronHandler = {
  ipcRenderer: {
    sendMessage<T extends OnChannels>(
      channel: T,
      ...args: [OnArgumentTypes[T]]
    ) {
      ipcRenderer.send(channel, ...args);
    },
    on<T extends OnChannels>(
      channel: T,
      func: (event: IpcRendererEvent, ...args: any[]) => void
    ) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(_event, ...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },

    invoke<T extends InvokeChannels>(
      channel: T,
      ...args: [InvokeArgumentTypes[T]]
    ): Promise<InvokeReturnTypes[T]> {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
