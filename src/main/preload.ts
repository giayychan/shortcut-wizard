// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import type {
  InvokeArgumentTypes,
  InvokeChannels,
  InvokeReturnTypes,
  OnArgumentTypes,
  OnChannels,
} from '../../@types';

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
