import { create } from 'zustand';
import Fuse from 'fuse.js';
import { FlattenShortcut } from '../../../@types';

export type FuseSearchState = {
  results: Fuse.FuseResult<FlattenShortcut>[];
  setResults: (results: Fuse.FuseResult<FlattenShortcut>[]) => void;

  isSearchResultsShow: boolean;
  setShowSearchResults: (isShow: boolean) => void;

  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;

  toggleSearchResults: () => void;
  reset: () => void;
};

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
