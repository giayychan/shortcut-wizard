import { useCallback, useMemo, memo } from 'react';
import Fuse from 'fuse.js';
import { IconRobot, IconSearch } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import {
  ActionIcon,
  CloseButton,
  Flex,
  TextInput,
  Tooltip,
} from '@mantine/core';
import useFuseSearchStore from '../../stores/useFuseSearch';
import {
  FlattenShortcut,
  SearchShortcutFormValues,
  SoftwareShortcut,
} from '../../../../@types';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import StyledSvg from '../common/StyledSvg';
import trpcReact from '../../utils/trpc';
import { notifyClientError } from '../../utils';

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
  const utils = trpcReact.useContext();
  const softwareShortcuts = utils.software.all.getData();

  const { data: enabledAiSearch, refetch: refetchEnabledAiSearch } =
    trpcReact.shortcut.ai.enabledAiSearch.useQuery();

  const { mutate: toggleAiSearch } =
    trpcReact.shortcut.ai.toggleAiSearch.useMutation({
      onSuccess: () => {
        refetchEnabledAiSearch();
      },
    });

  const { mutateAsync: aiSearchShortcuts } =
    trpcReact.shortcut.ai.search.useMutation();

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

  // const [debounced] = useDebouncedValue(searchTerm, 500);

  const flattenSearchData = useMemo(() => {
    if (!softwareShortcuts?.length) return [];
    return softwareShortcuts.reduce(
      (prev: FlattenShortcut[], curr: SoftwareShortcut) => {
        const { software, shortcuts, createdDate } = curr;

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

  const fuse = useMemo(() => {
    let searchData = flattenSearchData;

    if (selectedSoftwareShortcut) {
      searchData = flattenSearchData.filter((d) => {
        return d.software.key === selectedSoftwareShortcut?.software.key;
      });
    }

    return new Fuse(searchData, options);
  }, [flattenSearchData, selectedSoftwareShortcut]);

  const handleSubmit = useCallback(() => {
    setShowSearchResults(!!searchTerm);

    if (searchTerm === '') {
      setResults([]);
      return;
    }

    if (enabledAiSearch) {
      aiSearchShortcuts({
        userPrompt: searchTerm,
        softwareKey: selectedSoftwareShortcut?.software.key,
      })
        .then((res) => setResults(res))
        .catch((err) => notifyClientError(err.message));
    } else {
      const result = fuse.search(searchTerm);
      setResults(result);
    }
  }, [
    setShowSearchResults,
    setResults,
    fuse,
    searchTerm,
    aiSearchShortcuts,
    enabledAiSearch,
    selectedSoftwareShortcut?.software.key,
  ]);

  const reset = () => {
    setResults([]);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleAiToggle = () => toggleAiSearch(!enabledAiSearch);

  return (
    <Flex className="p-2" gap="xs" align="center">
      <Tooltip
        arrowOffset={10}
        arrowSize={4}
        label="Enable AI Search with your openAI API key. Go to settings and update your API key."
        withArrow
        events={{ hover: true, focus: true, touch: false }}
        position="bottom-start"
      >
        <ActionIcon
          variant={enabledAiSearch ? 'gradient' : 'default'}
          aria-label="ai search"
          onClick={handleAiToggle}
        >
          <IconRobot />
        </ActionIcon>
      </Tooltip>

      <form onSubmit={form.onSubmit(handleSubmit)} className="flex-1">
        <TextInput
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps('searchTerm')}
          rightSection={<CloseButton onClick={reset} />}
          w="100%"
          icon={
            selectedSoftwareShortcut ? (
              <StyledSvg
                src={selectedSoftwareShortcut?.software.icon.dataUri}
              />
            ) : (
              <IconSearch size="1.25rem" />
            )
          }
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          placeholder="Press enter to search shortcut description"
        />
      </form>
    </Flex>
  );
}

export default memo(SearchShortcutContainer);
