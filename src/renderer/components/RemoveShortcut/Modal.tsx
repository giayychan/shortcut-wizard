import { useForm } from '@mantine/form';
import {
  Group,
  Box,
  Button,
  LoadingOverlay,
  Text,
  Checkbox,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ContextModalProps } from '@mantine/modals';

import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import { RemoveShortcutFormValues } from '../../../../@types';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import useModalFormHeight from '../../hooks/useSetModalFormHeight';
import Hotkeys from '../common/ShortcutHotkeys';

const FORM_DEFAULT_VALUES = {
  initialValues: { shortcuts: [] },
};

function RemoveShortcutModal({ context, id }: ContextModalProps) {
  useModalFormHeight();

  const removeShortcutsBySelectedSoftware = useSoftwareShortcutsStore(
    (state) => state.removeShortcutsBySelectedSoftware
  );
  const form = useForm<RemoveShortcutFormValues>(FORM_DEFAULT_VALUES);

  const [visible, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);

  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const handleClear = () => {
    form.reset();
  };

  const handleCancel = () => {
    handleClear();
    context.closeModal(id);
  };

  const handleSubmit = async ({ shortcuts }: RemoveShortcutFormValues) => {
    if (!selectedSoftwareShortcut) return;
    if (!shortcuts.length) {
      form.setFieldError('shortcuts', 'Please select remove shortcut(s)');
      return;
    }

    openLoading();

    try {
      const removedShortcuts = selectedSoftwareShortcut.shortcuts?.filter(
        (shortcut) => {
          return shortcuts.includes(shortcut.id);
        }
      );

      await removeShortcutsBySelectedSoftware(removedShortcuts);
      handleCancel();
    } catch (error: any) {
      form.setFieldError('shortcuts', error.message);
    } finally {
      closeLoading();
    }
  };

  return selectedSoftwareShortcut &&
    selectedSoftwareShortcut.shortcuts?.length ? (
    <Box<'form'>
      component="form"
      maw="90%"
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay visible={visible} overlayBlur={2} />

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Checkbox.Group {...form.getInputProps('shortcuts')}>
        {selectedSoftwareShortcut.shortcuts?.map((shortcut) => {
          const { description, id: shortcutId, hotkeys } = shortcut;

          return (
            <Checkbox
              my="xs"
              key={shortcutId}
              value={shortcutId}
              label={
                <Group>
                  <Hotkeys hotkeys={hotkeys} />
                  <Text>{description}</Text>
                </Group>
              }
            />
          );
        })}
      </Checkbox.Group>

      <Group position="right" mt="xl">
        <Button variant="subtle" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="filled" type="submit">
          Remove
        </Button>

        <Button variant="light" onClick={handleCancel}>
          Cancel
        </Button>
      </Group>
    </Box>
  ) : (
    <Text>Nothing to remove</Text>
  );
}

export default RemoveShortcutModal;
