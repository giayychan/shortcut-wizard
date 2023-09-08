import { useCallback, useEffect, useMemo, memo } from 'react';
import Fuse from 'fuse.js';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { CloseButton, TextInput } from '@mantine/core';
import useFuseSearchStore from '../../stores/useFuseSearch';
import {
  FlattenShortcut,
  SearchShortcutFormValues,
  SoftwareShortcut,
} from '../../../../@types';
import trpc from '../../utils/trpc';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import StyledSvg from '../common/StyledSvg';

const FORM_DEFAULT_VALUES = {
  initialValues: {
    searchTerm: '',
  },
};

const options: Fuse.IFuseOptions<FlattenShortcut> = {
  keys: ['description', 'software.label'],
  minMatchCharLength: 1,
};

function SearchShortcutContainer() {
  const utils = trpc.useContext();
  const softwareShortcuts = utils.software.all.getData();

  const form = useForm<SearchShortcutFormValues>(FORM_DEFAULT_VALUES);
  const [setShowSearchResults, setResults, searchTerm, setSearchTerm] =
    useFuseSearchStore((state) => [
      state.setShowSearchResults,
      state.setResults,
      state.searchTerm,
      state.setSearchTerm,
    ]);

  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const [debounced] = useDebouncedValue(searchTerm, 500);

  const flattenSearchData = useMemo(() => {
    if (!softwareShortcuts?.length) return [];
    return softwareShortcuts.reduce(
      (prev: FlattenShortcut[], curr: SoftwareShortcut) => {
        const { software, shortcuts, createdDate } = curr;

        const shortcutsArray = shortcuts.map((shortcut) => ({
          ...shortcut,
          id: shortcut.id,
          software,
          createdDate,
        }));

        return [...prev, ...shortcutsArray];
      },
      []
    );
  }, [softwareShortcuts]);

  const fuse = useMemo(() => {
    let searchData = flattenSearchData;

    if (selectedSoftwareShortcut) {
      searchData = flattenSearchData.filter((d) => {
        return d.software.key === selectedSoftwareShortcut?.software.key;
      });
    }

    return new Fuse(searchData, options);
  }, [flattenSearchData, selectedSoftwareShortcut]);

  const handleChange = useCallback(
    (debouncedSearchTerm: string) => {
      setShowSearchResults(!!debouncedSearchTerm);

      if (debouncedSearchTerm === '') {
        setResults([]);
        return;
      }

      const result = fuse.search(debouncedSearchTerm);
      setResults(result);
    },
    [setShowSearchResults, setResults, fuse]
  );

  useEffect(() => {
    handleChange(debounced);
  }, [debounced, handleChange]);

  const handleSubmit = useCallback(async () => {
    handleChange(searchTerm);
  }, [searchTerm, handleChange]);

  const reset = () => {
    setResults([]);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="flex-1 p-2">
      <TextInput
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('searchTerm')}
        rightSection={<CloseButton onClick={reset} />}
        icon={
          selectedSoftwareShortcut ? (
            <StyledSvg src={selectedSoftwareShortcut?.software.icon.dataUri} />
          ) : (
            <IconSearch size="1.25rem" />
          )
        }
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        placeholder="Search shortcut description"
      />
    </form>
  );
}

export default memo(SearchShortcutContainer);
