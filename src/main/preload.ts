// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import type {
  Shortcut,
  SoftwareShortcut,
  SoftwareShortcuts,
} from '../../@types/shortcuts';

export type OnArgumentTypes = {
  setWindowHeight: [height: number];
};

export type OnChannels = keyof OnArgumentTypes;

export type InvokeReturnTypes = {
  fetchSoftwareShortcuts: SoftwareShortcuts;
  fetchSoftwareShortcut: SoftwareShortcut;
  addShortcutsBySoftwareKey: void;
  removeShortcutsBySoftwareKey: void;
  addSoftwareShortcut: void;
  removeSoftwareShortcut: void;
};

export type InvokeArgumentTypes = {
  fetchSoftwareShortcuts: undefined;
  fetchSoftwareShortcut: [softwareKey: string];
  addShortcutsBySoftwareKey: [softwareKey: string, shortcuts: Shortcut[]];
  removeShortcutsBySoftwareKey: [softwareKey: string, shortcuts: Shortcut[]];
  addSoftwareShortcut: [
    data: SoftwareShortcut,
    uploadedCustomIconPath?: string
  ];
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
