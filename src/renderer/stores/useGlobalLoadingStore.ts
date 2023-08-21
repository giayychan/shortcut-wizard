import { create } from 'zustand';
import { GlobalLoadingState } from '../../../@types';

const useGlobalLoadingStore = create<GlobalLoadingState, []>((set) => ({
  visible: true,
  setVisible: (visible) => {
    set({ visible });
  },
}));

export default useGlobalLoadingStore;
