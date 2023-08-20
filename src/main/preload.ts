// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import { exposeElectronTRPC } from 'electron-trpc/main';
import type {
  InvokeArgumentTypes,
  InvokeChannels,
  InvokeReturnTypes,
} from '../../@types';

export type Channels = 'authChanged' | 'loaded';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels) {
      ipcRenderer.send(channel);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
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

process.once('loaded', async () => {
  exposeElectronTRPC();
});

export type ElectronHandler = typeof electronHandler;
