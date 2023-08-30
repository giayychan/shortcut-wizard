import { useCallback, useEffect, useMemo, memo } from 'react';
import Fuse from 'fuse.js';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { TextInput } from '@mantine/core';
import useFuseSearchStore from '../../stores/useFuseSearch';
import { FlattenShortcut, SearchShortcutFormValues } from '../../../../@types';
import trpc from '../../utils/trpc';

const FORM_DEFAULT_VALUES = {
  initialValues: {
    searchTerm: '',
  },
};

const options: Fuse.IFuseOptions<FlattenShortcut> = {
  keys: ['description', 'software.key'],
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

  const [debounced] = useDebouncedValue(searchTerm, 500);

  const flattenShortcutWithSoftwareDataArray = useMemo(() => {
    if (!softwareShortcuts) return [];
    return Object.keys(softwareShortcuts).reduce(
      (prev: FlattenShortcut[], curr: string) => {
        const { software, shortcuts, createdDate } = softwareShortcuts[curr];

        const shortcutsArray = shortcuts.map((shortcut) => ({
          ...shortcut,
          id: `${software.key}-${shortcut.id}`,
          software,
          createdDate,
        }));

        return [...prev, ...shortcutsArray];
      },
      []
    );
  }, [softwareShortcuts]);

  console.log({ flattenShortcutWithSoftwareDataArray });

  const fuse = useMemo(
    () => new Fuse(flattenShortcutWithSoftwareDataArray, options),
    [flattenShortcutWithSoftwareDataArray]
  );

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

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="flex-1">
      <TextInput
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('searchTerm')}
        icon={<IconSearch size="1.25rem" />}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        placeholder="Search shortcut description"
      />
    </form>
  );
}

export default memo(SearchShortcutContainer);
