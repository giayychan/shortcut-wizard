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
};

const useFuseSearchStore = create<FuseSearchState, []>((set) => ({
  isSearchResultsShow: false,
  setShowSearchResults: (isShow) => {
    set({ isSearchResultsShow: isShow });
  },

  searchTerm: '',
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },

  results: [],
  setResults: (results) => {
    set({ results });
  },
}));

export default useFuseSearchStore;
