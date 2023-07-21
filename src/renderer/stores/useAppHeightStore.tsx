import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppHeightState } from '../../../@types';

const { ipcRenderer } = window.electron;

const useAppHeightStore = create(
  subscribeWithSelector<AppHeightState>((set, get) => ({
    previousHeight: 0,
    height: 0,
    setHeight: (updatedHeight) => {
      const { previousHeight } = get();
      if (updatedHeight === 0) return;
      const { height } = get();

      set({ height: updatedHeight || previousHeight, previousHeight: height });

      // todo: devs log only
      console.log('sendMessage - updateMainWindowHeight', [
        Math.round(updatedHeight || previousHeight),
      ]);
      ipcRenderer.sendMessage('updateMainWindowHeight', [
        Math.round(updatedHeight || previousHeight),
      ]);
    },
  }))
);

export default useAppHeightStore;
