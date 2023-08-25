// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge } from 'electron';
import { exposeElectronTRPC } from 'electron-trpc/main';

// todo: remove in prod if not used
const electronHandler = {
  // ipcRenderer: {
  //   invoke<T extends >(
  //     channel: T,
  //     ...args: [[T]]
  //   ): Promise<[T]> {
  //     return ipcRenderer.invoke(channel, ...args);
  //   },
  // },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

process.once('loaded', async () => {
  exposeElectronTRPC();
});

export type ElectronHandler = typeof electronHandler;
