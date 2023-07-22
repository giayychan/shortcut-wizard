import { useForm } from '@mantine/form';
import {
  Group,
  Box,
  Button,
  LoadingOverlay,
  TextInput,
  Input,
  Stack,
  Checkbox,
  Flex,
} from '@mantine/core';
import { useDisclosure, useTimeout, useToggle } from '@mantine/hooks';
import { ContextModalProps } from '@mantine/modals';
import { useRecordHotkeys } from 'react-hotkeys-hook';
import { IconPlayerRecordFilled } from '@tabler/icons-react';
import { useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';

import useModalFormHeight from '../hooks/useSetModalFormHeight';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import { AddShortcutFormValues } from '../../../../@types';
import mapArrayWithId from '../../utils';
import Hotkey from '../common/ShortcutHotkey';

const FORM_DEFAULT_VALUES = {
  initialValues: {
    description: '',
    id: '',
    hotkeys: [],
    isFavorite: false,
  },
};

function AddShortcutModal({ context, id }: ContextModalProps) {
  useModalFormHeight();

  const [keys, { start, stop, isRecording }] = useRecordHotkeys();

  const [currentSet, toggle] = useToggle(['first', 'second']);

  const addShortcutBySelectedSoftware = useSoftwareShortcutsStore(
    (state) => state.addShortcutBySelectedSoftware
  );
  const form = useForm<AddShortcutFormValues>(FORM_DEFAULT_VALUES);

  const { start: clearHotkeysFieldError } = useTimeout(
    () => form.clearFieldError('hotkeys'),
    3000
  );

  const [visible, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);

  // useCallback hook to memoize the callback function
  const handleKeysChange = useCallback(() => {
    if (isRecording) {
      const keysArray = Array.from(keys);

      if (keys.size > 3) {
        form.setFieldError(
          'hotkeys',
          'You can only record up to 3 keys at a time'
        );
        clearHotkeysFieldError();
        return;
      }

      form.setFieldValue(
        currentSet === 'first' ? 'hotkeys.0' : 'hotkeys.1',
        keysArray
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  useEffect(() => {
    handleKeysChange();
  }, [handleKeysChange]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handleRecordButtonClick = (set: 'first' | 'second') => {
    if (!isRecording) {
      toggle(set);
      start();
    } else if (currentSet === set) {
      stop();
    } else {
      stop();
      start();
      toggle(set);
    }
  };

  const handleClear = () => {
    stop();
    form.reset();
  };

  const handleCancel = () => {
    handleClear();
    context.closeModal(id);
  };

  const handleSubmit = async (values: AddShortcutFormValues) => {
    stop();

    const { description, hotkeys } = values;

    if (!description) {
      form.setFieldError('description', 'Please enter description');
      return;
    }

    if (!hotkeys[0]?.length) {
      form.setFieldError('hotkeys', 'Please record hotkeys');
      clearHotkeysFieldError();
      return;
    }

    openLoading();

    const newShortcut = {
      ...values,
      id: nanoid(),
      hotkeys,
      description,
    };

    try {
      await addShortcutBySelectedSoftware(newShortcut);
    } catch (error: any) {
      form.setFieldError('hotkeys', error.message);
    } finally {
      closeLoading();
      handleCancel();
    }
  };

  const [firstSetHotkey, secondSetHotkey] = mapArrayWithId(form.values.hotkeys);

  return (
    <Box<'form'>
      component="form"
      maw="90%"
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay visible={visible} overlayBlur={2} />

      <TextInput
        placeholder="Description will be used in search"
        label="Description"
        mb="md"
        withAsterisk
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('description')}
      />

      <Input.Wrapper
        label="Hot Keys"
        withAsterisk
        description="Click the record button to start recording hot keys. Press it again to stop recording. You can record 2 sets of hot key & each hot key can contain 3 keys."
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('hotkeys')}
      >
        <Flex gap="md" my="md">
          <Stack>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleRecordButtonClick('first')}
              leftIcon={
                <IconPlayerRecordFilled
                  size="1rem"
                  className={
                    isRecording && currentSet === 'first'
                      ? 'animate-record'
                      : 'animate-none'
                  }
                />
              }
            >
              {isRecording && currentSet === 'first' ? 'Recording' : 'Record'}{' '}
              first set
            </Button>
            {firstSetHotkey?.value ? (
              <Hotkey hotkey={firstSetHotkey.value} />
            ) : null}
          </Stack>
          <Stack>
            <Button
              disabled={!firstSetHotkey?.value?.length}
              variant="outline"
              size="xs"
              onClick={() => handleRecordButtonClick('second')}
              leftIcon={
                <IconPlayerRecordFilled
                  size="1rem"
                  className={
                    isRecording && currentSet === 'second'
                      ? 'animate-record'
                      : 'animate-none'
                  }
                />
              }
            >
              {isRecording && currentSet === 'second' ? 'Recording' : 'Record'}{' '}
              second set
            </Button>
            {secondSetHotkey?.value ? (
              <Hotkey hotkey={secondSetHotkey.value} />
            ) : null}
          </Stack>
        </Flex>
      </Input.Wrapper>

      {/* <Hotkeys hotkeys={form.values.hotkeys} /> */}

      <Checkbox
        my="xl"
        label="Favorite shortcut"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('isFavorite')}
      />

      <Group position="right" mt="xl">
        <Button onClick={handleClear} variant="subtle">
          Clear
        </Button>
        <Button variant="filled" type="submit">
          Add
        </Button>

        <Button variant="light" onClick={handleCancel}>
          Cancel
        </Button>
      </Group>
    </Box>
  );
}

export default AddShortcutModal;
