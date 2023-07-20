import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';

import { MAX_HEIGHT } from 'main/constants';
import useAppHeightStore from '../../stores/useAppHeightStore';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import StyledSvg from '../common/StyledSvg';
import {
  RemoveSoftwareFormProps,
  RemoveSoftwareFormValues,
  SoftwareShortcut,
} from '../../../../@types';

const FORM_DEFAULT_VALUES = {
  initialValues: {
    removedSoftwares: [],
  },
};

function RemoveSoftwareForm({ close }: RemoveSoftwareFormProps) {
  const [setHeight] = useAppHeightStore((state) => [state.setHeight]);
  useEffect(() => {
    setHeight(MAX_HEIGHT);
    return () => {
      setHeight();
    };
  }, [setHeight]);

  const [removeSoftwares, softwareShortcuts] = useSoftwareShortcutsStore(
    (state) => [state.removeSoftwares, state.softwareShortcuts]
  );

  const softwareList = Object.keys(softwareShortcuts);

  const form = useForm<RemoveSoftwareFormValues>(FORM_DEFAULT_VALUES);

  const [visible, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);

  const handleClear = () => {
    form.reset();
  };

  const handleCancel = () => {
    handleClear();
    close();
  };

  const handleSubmit = async (values: RemoveSoftwareFormValues) => {
    openLoading();
    const { removedSoftwares } = values;

    if (!removedSoftwares.length) {
      form.setFieldError('removedSoftwares', 'Please select at least one.');
      return;
    }
    try {
      await removeSoftwares(removedSoftwares);
      handleCancel();
    } catch (error: any) {
      form.setFieldError('removedSoftwares', error.message);
    } finally {
      closeLoading();
    }
  };

  return (
    <Box<'form'>
      component="form"
      maw={320}
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay visible={visible} overlayBlur={2} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Checkbox.Group {...form.getInputProps('removedSoftwares')}>
        {softwareList.map((softwareKey) => {
          const data: SoftwareShortcut = softwareShortcuts[softwareKey];
          const {
            software: {
              icon: { dataUri },
              key,
            },
          } = data;

          return (
            <Checkbox
              my="xs"
              value={key}
              label={
                <Flex gap="xs" className="capitalize">
                  {dataUri ? <StyledSvg src={dataUri} /> : undefined}
                  {key}
                </Flex>
              }
            />
          );
        })}
      </Checkbox.Group>

      <Group position="right" mt="xl">
        <Button onClick={handleClear}>Clear</Button>
        <Button variant="outline" type="submit">
          Remove
        </Button>

        <Button variant="light" onClick={handleCancel}>
          Cancel
        </Button>
      </Group>
    </Box>
  );
}

export default RemoveSoftwareForm;
