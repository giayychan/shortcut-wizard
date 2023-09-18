/* eslint-disable react/require-default-props */

import {
  Flex,
  ScrollArea,
  Button,
  NativeSelect,
  Divider,
  Text,
  Box,
  Checkbox,
  Group,
  ActionIcon,
  Stack,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { IconEdit, IconStar } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import trpcReact from '../../utils/trpc';
import StyledSvg from '../common/StyledSvg';
import { RemoveShortcutFormValues, TabType } from '../../../../@types';
import Hotkeys from '../common/ShortcutHotkeys';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import EditShortcut from '../EditShortcut/Form';
import { notifyClientError, notifyClientInfo } from '../../utils';

const FORM_DEFAULT_VALUES = {
  initialValues: { shortcuts: [] },
};

function EditShortcutSetting({
  type,
  setSelectedTab,
}: {
  type: 'Edit' | 'Add';
  setSelectedTab?: (tab: TabType) => void;
}) {
  const utils = trpcReact.useContext();
  const softwareShortcuts = utils.software.all.getData();

  const globalSelectedSoftware = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const [value, setValue] = useState(
    globalSelectedSoftware ? globalSelectedSoftware.software.key : ''
  );

  const selectedSoftware = softwareShortcuts?.find((softwareShortcut) => {
    return softwareShortcut.software.key === value;
  });

  const { mutateAsync, isLoading } = trpcReact.shortcut.delete.useMutation();

  const { mutateAsync: bulkFavorite, isLoading: updatingFavorite } =
    trpcReact.software.update.useMutation();

  const form = useForm<RemoveShortcutFormValues>({
    ...FORM_DEFAULT_VALUES,
    validate: {
      shortcuts: (shortcutsValue) => {
        if (!shortcutsValue.length) {
          return 'Please select shortcut(s)';
        }
        return null;
      },
    },
  });

  const handleClear = () => {
    form.reset();
  };

  const handleCancel = () => {
    handleClear();
  };

  const handleSubmit = async ({ shortcuts }: RemoveShortcutFormValues) => {
    if (!softwareShortcuts) return;

    try {
      if (selectedSoftware) {
        const removedShortcuts = selectedSoftware.shortcuts.filter(
          (shortcut) => {
            return shortcuts.includes(shortcut.id);
          }
        );
        await mutateAsync({
          softwareKey: selectedSoftware.software.key,
          shortcuts: removedShortcuts,
        });
        await utils.software.all.refetch();
        notifyClientInfo('Shortcut(s) deleted');
      }
      handleCancel();
    } catch (error: any) {
      form.setFieldError('shortcuts', error.message);
    }
  };

  const handleFavorite = async (id: string) => {
    try {
      if (selectedSoftware) {
        const updatedShortcuts = selectedSoftware.shortcuts?.map((shortcut) => {
          if (shortcut.id === id) {
            return {
              ...shortcut,
              isFavorite: !shortcut.isFavorite,
            };
          }
          return shortcut;
        });

        selectedSoftware.shortcuts = updatedShortcuts;

        await bulkFavorite(selectedSoftware);
        await utils.software.all.refetch();
        notifyClientInfo('Shortcut updated');
      }

      handleCancel();
    } catch (error: any) {
      form.setFieldError('shortcuts', error.message);
    }
  };

  const handleBulkFavorite = async () => {
    if (!selectedSoftware?.shortcuts?.length) return;

    const { shortcuts } = form.values;

    try {
      const updatedShortcuts = selectedSoftware.shortcuts.map((shortcut) => ({
        ...shortcut,
        isFavorite: shortcuts.includes(shortcut.id)
          ? !shortcut.isFavorite
          : shortcut.isFavorite,
      }));

      selectedSoftware.shortcuts = updatedShortcuts;

      await bulkFavorite(selectedSoftware);
      await utils.software.all.refetch();
      notifyClientInfo('Shortcut(s) updated');

      handleCancel();
    } catch (error: any) {
      form.setFieldError('shortcuts', error.message);
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const handleOpenEditShortcut = (shortcutId?: string) => {
    if (setSelectedTab) {
      setSelectedTab('Add Shortcut');
      if (shortcutId) setSearchParams({ shortcutId, from: 'modal' });
      return;
    }

    notifyClientError('Error opening shortcut editor');
  };

  const selectedOption = softwareShortcuts
    ? [
        {
          value: '',
          key: '',
          label: 'Please select software',
        },
        ...softwareShortcuts.map((softwareShortcut) => {
          return {
            value: softwareShortcut.software.key,
            key: softwareShortcut.software.key,
            label: softwareShortcut.software.label,
          };
        }),
      ]
    : [
        {
          value: '',
          key: '',
          label: 'Please select software',
        },
      ];

  const handleSelectAll = (event: any) => {
    const isChecked = event.target.checked;
    if (!selectedSoftware || !selectedSoftware.shortcuts?.length) return;

    if (isChecked) {
      form.setFieldValue(
        'shortcuts',
        selectedSoftware.shortcuts.map((shortcut) => shortcut.id)
      );
    } else {
      form.setFieldValue('shortcuts', []);
    }
  };

  if (type === 'Add') {
    const shortcutIdParam = searchParams.get('shortcutId');

    return (
      <Box className="flex flex-col h-full">
        <Flex align="center">
          <Text size="xl" mb="lg">
            {type} Shortcut
          </Text>
        </Flex>
        <NativeSelect
          disabled={selectedOption.length === 1}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          data={selectedOption}
          label={`Select software to ${type.toLowerCase()} shortcut`}
          variant="filled"
          radius="md"
          withAsterisk
          icon={
            selectedSoftware ? (
              <StyledSvg src={selectedSoftware.software.icon.dataUri} />
            ) : null
          }
        />

        {selectedSoftware?.software.key && (
          <EditShortcut
            softwareKey={selectedSoftware.software.key}
            shortcut={selectedSoftware.shortcuts.find(
              (s) => s.id === shortcutIdParam
            )}
          />
        )}
      </Box>
    );
  }

  return (
    <Box<'form'>
      className="flex flex-col h-full"
      component="form"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Flex align="center">
        <Text size="xl" mb="lg">
          {type} Shortcut
        </Text>

        <Group ml="auto">
          <Button
            type="submit"
            variant="light"
            disabled={
              !value || !form.values.shortcuts?.length || updatingFavorite
            }
            loading={isLoading}
          >
            Delete
          </Button>
          <Button
            variant="light"
            disabled={!value || !form.values.shortcuts?.length || isLoading}
            loading={updatingFavorite}
            onClick={handleBulkFavorite}
          >
            (Un)favorite
          </Button>
        </Group>
      </Flex>
      <NativeSelect
        disabled={selectedOption.length === 1}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        data={selectedOption}
        label={`Select software to ${type.toLowerCase()} shortcut`}
        variant="filled"
        radius="md"
        withAsterisk
        icon={
          selectedSoftware ? (
            <StyledSvg src={selectedSoftware.software.icon.dataUri} />
          ) : null
        }
      />

      <Divider mt="xs" />
      <ScrollArea h="100%" offsetScrollbars>
        {value && selectedSoftware && selectedSoftware.shortcuts?.length ? (
          <>
            <Checkbox label="Select all" my={15} onClick={handleSelectAll} />
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Checkbox.Group {...form.getInputProps('shortcuts')}>
              {selectedSoftware.shortcuts
                .sort((a, b) => {
                  if (a.isFavorite && !b.isFavorite) {
                    return -1;
                  }
                  if (!a.isFavorite && b.isFavorite) {
                    return 1;
                  }
                  return 0;
                })
                .map((shortcut) => {
                  const { description, id, hotkeys, isFavorite } = shortcut;

                  return (
                    <Flex my="md" align="start" key={id}>
                      <Checkbox
                        key={id}
                        value={id}
                        label={
                          <Stack spacing="xs">
                            <Group>
                              <Text truncate>{description}</Text>
                            </Group>
                            <Hotkeys hotkeys={hotkeys} />
                          </Stack>
                        }
                      />
                      <Group className="ml-auto">
                        <ActionIcon
                          variant="light"
                          onClick={() => handleOpenEditShortcut(id)}
                        >
                          <IconEdit size="1rem" />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          onClick={() => handleFavorite(id)}
                        >
                          <IconStar
                            size="1rem"
                            fill={isFavorite ? 'white' : 'transparent'}
                          />
                        </ActionIcon>
                      </Group>
                    </Flex>
                  );
                })}
            </Checkbox.Group>
          </>
        ) : (
          value && (
            <Button
              onClick={() => handleOpenEditShortcut()}
              variant="light"
              className="p-3"
            >
              Add shortcut
            </Button>
          )
        )}
      </ScrollArea>
    </Box>
  );
}

export default EditShortcutSetting;
