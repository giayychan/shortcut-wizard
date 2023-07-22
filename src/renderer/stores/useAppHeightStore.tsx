import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppHeightState } from '../../../@types';

const { ipcRenderer } = window.electron;

const useAppHeightStore = create(
  subscribeWithSelector<AppHeightState>((set, get) => ({
    height: 0,
    setHeight: (updatedHeight, { update }) => {
      if (updatedHeight === 0) return;
      const { height } = get();

      const roundedHeight = Math.round(updatedHeight || height);

      if (update) set({ height: roundedHeight });

      // todo: devs log only
      console.log('sendMessage - updateMainWindowHeight: ', roundedHeight);

      ipcRenderer.sendMessage('updateMainWindowHeight', [roundedHeight]);
    },
  }))
);

export default useAppHeightStore;
