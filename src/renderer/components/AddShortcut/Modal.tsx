import { useForm } from '@mantine/form';
import {
  Group,
  Box,
  Button,
  TextInput,
  Input,
  Stack,
  Checkbox,
  Flex,
} from '@mantine/core';
import { useClickOutside, useTimeout, useToggle } from '@mantine/hooks';
import { useRecordHotkeys } from 'react-hotkeys-hook';
import { IconPlayerRecordFilled } from '@tabler/icons-react';
import { useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';

import { EditShortcutFormValues, Shortcut } from '../../../../@types';
import { mapArrayWithId } from '../../utils';
import Hotkey from '../common/ShortcutHotkey';
import trpcReact from '../../utils/trpc';

const FORM_DEFAULT_VALUES = {
  initialValues: {
    description: '',
    id: '',
    hotkeys: [],
    isFavorite: false,
  },
};

function EditShortcut({
  shortcut,
  close,
  softwareKey,
}: {
  // eslint-disable-next-line react/require-default-props
  shortcut?: Shortcut;
  close: () => void;
  softwareKey: string;
}) {
  const utils = trpcReact.useContext();
  const isUpdateShortcut = Boolean(shortcut);
  const [keys, { start, stop, isRecording }] = useRecordHotkeys();
  const clickOutsideRef = useClickOutside(() => stop());

  const [currentSet, toggle] = useToggle(['first', 'second']);

  const addShortcut = trpcReact.shortcut.create.useMutation();
  const updateShortcut = trpcReact.shortcut.update.useMutation();

  const form = useForm<EditShortcutFormValues>(
    isUpdateShortcut
      ? {
          initialValues: shortcut,
        }
      : FORM_DEFAULT_VALUES
  );

  const [firstSetHotkey, secondSetHotkey] = mapArrayWithId(
    form.values.hotkeys || []
  );

  const { start: clearHotkeysFieldError } = useTimeout(
    () => form.clearFieldError('hotkeys'),
    3000
  );

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
    close();
  };

  const handleSubmit = async (values: EditShortcutFormValues) => {
    const { description, hotkeys } = values;

    if (!description) {
      form.setFieldError('description', 'Please enter description');
      return;
    }

    if (!hotkeys || !hotkeys[0]?.length) {
      form.setFieldError('hotkeys', 'Please record hotkeys');
      clearHotkeysFieldError();
      return;
    }

    const updatedShortcut = {
      ...values,
      id: shortcut?.id || nanoid(),
      hotkeys,
      description,
      isFavorite: values.isFavorite === undefined ? false : values.isFavorite,
    };

    try {
      if (isUpdateShortcut)
        await updateShortcut.mutateAsync({
          shortcut: updatedShortcut,
          softwareKey,
        });
      else {
        await addShortcut.mutateAsync({
          shortcut: updatedShortcut,
          softwareKey,
        });
      }
      await utils.software.all.refetch();
      handleCancel();
    } catch (error: any) {
      form.setFieldError('hotkeys', error.message);
    }
  };

  return (
    <Box<'form'>
      component="form"
      maw="90%"
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <TextInput
        placeholder="Description will be used in search"
        label="Description"
        mb="md"
        size="md"
        withAsterisk
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('description')}
      />
      <Input.Wrapper
        label="Hot Keys"
        withAsterisk
        description="Click the record button to start recording hot keys. Press it again to stop recording. You can record 2 sets of hot key's & each hot key can contain 3 key's."
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('hotkeys')}
        size="md"
      >
        <Flex gap="md" my="md">
          <Stack>
            <Button
              ref={clickOutsideRef}
              variant="outline"
              color={isRecording && currentSet === 'first' ? 'red' : 'blue'}
              size="sm"
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
              ref={clickOutsideRef}
              disabled={!firstSetHotkey?.value?.length}
              variant="outline"
              color={isRecording && currentSet === 'second' ? 'red' : 'blue'}
              size="sm"
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
      <Checkbox
        my="xl"
        size="md"
        label="Favorite shortcut"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('isFavorite', { type: 'checkbox' })}
      />
      <Group position="right" mt="xl">
        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
        <Button variant="filled" type="submit">
          Confirm
        </Button>

        <Button variant="light" onClick={handleCancel}>
          Cancel
        </Button>
      </Group>
    </Box>
  );
}

export default EditShortcut;
