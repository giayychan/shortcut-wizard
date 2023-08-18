// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { exposeElectronTRPC } from 'electron-trpc/main';
import type {
  InvokeArgumentTypes,
  InvokeChannels,
  InvokeReturnTypes,
} from '../../@types';

// const ipc = {
//   'render': {
//       // From render to main.
//       'send': [
//           'window:minimize',
//           'window:maximize',
//           'window:restore',
//           'window:close'
//       ],
//       // From main to render.
//       'receive': [],
//       // From render to main and back again.
//       'sendReceive': []
//   }
// };

const electronHandler = {
  ipcRenderer: {
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
