import Fuse from 'fuse.js';
import { IconSearch } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { TextInput } from '@mantine/core';
import { ChangeEvent } from 'react';
import useFuseSearchStore from '../../stores/useFuseSearch';
import { FlattenShortcut, SearchShortcutFormValues } from '../../../../@types';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';

const FORM_DEFAULT_VALUES = {
  initialValues: {
    searchTerm: '',
  },
};

function SearchShortcutContainer() {
  const form = useForm<SearchShortcutFormValues>(FORM_DEFAULT_VALUES);
  const [setShowSearchResults, setResults, searchTerm, setSearchTerm] =
    useFuseSearchStore((state) => [
      state.setShowSearchResults,
      state.setResults,
      state.searchTerm,
      state.setSearchTerm,
    ]);

  const softwareShortcuts = useSoftwareShortcutsStore(
    (state) => state.softwareShortcuts
  );

  const flattenShortcutWithSoftwareDataArray = Object.keys(
    softwareShortcuts
  ).reduce((prev: FlattenShortcut[], curr: string) => {
    const { software, shortcuts } = softwareShortcuts[curr];

    const shortcutsArray = shortcuts.map((shortcut) => ({
      ...shortcut,
      id: `${software.key}-${shortcut.id}`,
      software,
    }));

    return [...prev, ...shortcutsArray];
  }, []);

  const options: Fuse.IFuseOptions<FlattenShortcut> = {
    keys: ['description', 'software.key'],
    // looks like still only match if search term is 2 characters or more, weird!
    minMatchCharLength: 1,
  };

  const fuse = new Fuse(flattenShortcutWithSoftwareDataArray, options);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    setShowSearchResults(!!searchValue);

    if (searchValue === '') {
      setResults([]);
      return;
    }

    const result = fuse.search(searchTerm);
    setResults(result);
  };

  const handleSubmit = async () => {
    handleChange({
      target: { value: searchTerm },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('searchTerm')}
        icon={<IconSearch size="1.25rem" />}
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search shortcut description or software name"
        mb="md"
      />
    </form>
  );
}

export default SearchShortcutContainer;
