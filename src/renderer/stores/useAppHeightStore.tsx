import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppHeightState } from '../../../@types';

const useAppHeightStore = create(
  subscribeWithSelector<AppHeightState>((set, get) => ({
    height: 0,
    setHeight: (updatedHeight, { update }, callback) => {
      if (updatedHeight === 0) return;
      const { height } = get();

      const roundedHeight = Math.round(updatedHeight || height);

      if (update) set({ height: roundedHeight });

      callback({ height: roundedHeight });
    },
  }))
);

export default useAppHeightStore;
