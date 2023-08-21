import { create } from 'zustand';
import { GlobalLoadingState } from '../../../@types';

const useGlobalLoadingStore = create<GlobalLoadingState, []>((set) => ({
  loading: true,
  setLoading: (loading) => {
    set({ loading });
  },
}));

export default useGlobalLoadingStore;
