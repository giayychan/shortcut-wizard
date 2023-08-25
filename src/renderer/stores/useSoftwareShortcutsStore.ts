import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SoftwareShortcutsState } from '../../../@types';

const defaultState = {
  softwareShortcuts: {},
};

const useSoftwareShortcutsStore = create(
  subscribeWithSelector<SoftwareShortcutsState>((set, get) => ({
    ...defaultState,
  }))
);

export default useSoftwareShortcutsStore;
