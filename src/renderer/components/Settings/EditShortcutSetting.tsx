import {
  Aside,
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
  Drawer,
} from '@mantine/core';
import { IconEdit, IconStar } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import trpcReact from '../../utils/trpc';
import StyledSvg from '../common/StyledSvg';
import { RemoveShortcutFormValues, Shortcut } from '../../../../@types';
import Hotkeys from '../common/ShortcutHotkeys';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import useEditShortcutStore from '../../stores/useEditShortcutStore';
import EditShortcut from '../EditShortcut/Form';

const FORM_DEFAULT_VALUES = {
  initialValues: { shortcuts: [] },
};

function EditShortcutSetting() {
  const utils = trpcReact.useContext();
  const softwareShortcuts = utils.software.all.getData();

  const globalSelectedSoftware = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const [
    opened,
    shortcutId,
    softwareKey,
    setOpened,
    setShortcutId,
    setSoftwareKey,
  ] = useEditShortcutStore((state) => [
    state.opened,
    state.shortcutId,
    state.softwareKey,
    state.setOpened,
    state.setShortcutId,
    state.setSoftwareKey,
  ]);

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
        return true;
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
      }
      handleCancel();
    } catch (error: any) {
      form.setFieldError('shortcuts', error.message);
    }
  };

  const handleBulkFavorite = async () => {
    if (!softwareShortcuts) return;

    const { shortcuts } = form.values;

    try {
      if (selectedSoftware) {
        const updatedShortcuts = selectedSoftware.shortcuts?.map((shortcut) => {
          if (shortcuts.includes(shortcut.id)) {
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
      }

      handleCancel();
    } catch (error: any) {
      form.setFieldError('shortcuts', error.message);
    }
  };

  const close = () => {
    setOpened(false);
    setShortcutId('');
    setSoftwareKey('');
  };
  const selectedOption = softwareShortcuts
    ? [
        {
          value: '',
          key: '',
          label: '',
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
          label: '',
        },
      ];

  return (
    <Aside>
      <Drawer
        closeOnEscape={false}
        withCloseButton={false}
        opened={Boolean(softwareKey && opened)}
        onClose={close}
        title="Edit Shortcut"
        padding="xl"
        size="xl"
        position="right"
        zIndex={10000}
        styles={{
          header: {
            paddingTop: 50,
          },
        }}
      >
        <EditShortcut
          close={close}
          softwareKey={softwareKey}
          shortcut={selectedSoftware?.shortcuts.find(
            (shortcut: Shortcut) => shortcut.id === shortcutId
          )}
        />
      </Drawer>
      <Box<'form'>
        className="flex flex-col h-full "
        h="100%"
        p="md"
        pt={40}
        component="form"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <NativeSelect
          disabled={selectedOption.length === 1}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          data={selectedOption}
          label="Select software to edit its shortcut"
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

        <ScrollArea className="flex-1" offsetScrollbars>
          {value && selectedSoftware && selectedSoftware.shortcuts?.length ? (
            // eslint-disable-next-line react/jsx-props-no-spreading
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
                    <Flex w="100%" my="xs" align="center" key={id}>
                      <Checkbox
                        key={id}
                        value={id}
                        label={
                          <Group align="center">
                            <IconStar
                              size="1rem"
                              fill={isFavorite ? 'white' : 'transparent'}
                            />
                            <Hotkeys hotkeys={hotkeys} />
                            <Text>{description}</Text>
                          </Group>
                        }
                      />
                      <ActionIcon
                        ml="auto"
                        variant="light"
                        onClick={() => {
                          setOpened(true);
                          setShortcutId(id);
                          setSoftwareKey(value);
                        }}
                      >
                        <IconEdit size="1rem" />
                      </ActionIcon>
                    </Flex>
                  );
                })}
            </Checkbox.Group>
          ) : (
            <Text className="p-3" hidden={!value}>
              No shortcut
            </Text>
          )}
        </ScrollArea>

        <Group p="md" w="100%">
          <Button
            compact
            color="orange"
            disabled={
              !value || !form.values.shortcuts?.length || updatingFavorite
            }
            type="submit"
            loading={isLoading}
          >
            Delete
          </Button>
          <Button
            compact
            color="pink"
            disabled={!value || !form.values.shortcuts?.length || isLoading}
            loading={updatingFavorite}
            onClick={handleBulkFavorite}
          >
            (Un)favorite
          </Button>
          <Button
            compact
            color="indigo"
            disabled={!value}
            onClick={() => {
              setOpened(true);
              setShortcutId('');
              setSoftwareKey(value);
            }}
          >
            Add new shortcut
          </Button>
        </Group>
      </Box>
    </Aside>
  );
}

export default EditShortcutSetting;
