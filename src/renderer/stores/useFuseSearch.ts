import { create } from 'zustand';
import { FuseSearchState } from '../../../@types';

const useFuseSearchStore = create<FuseSearchState, []>((set, get) => ({
  isSearchResultsShow: false,
  setShowSearchResults: (isShow) => {
    set({ isSearchResultsShow: isShow });
  },

  searchTerm: '',
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },

  toggleSearchResults: () => {
    const { isSearchResultsShow } = get();
    set({ isSearchResultsShow: !isSearchResultsShow });
  },

  results: [],
  setResults: (results) => {
    set({ results });
  },

  reset: () => {
    set({ results: [], searchTerm: '', isSearchResultsShow: false });
  },
}));

export default useFuseSearchStore;
