import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type AppHeightState = {
  previousHeight: number;
  height: number;
  setHeight: (height?: number) => void;
};

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
      ipcRenderer.sendMessage('updateMainWindowHeight', [
        updatedHeight || previousHeight,
      ]);
    },
  }))
);

export default useAppHeightStore;
