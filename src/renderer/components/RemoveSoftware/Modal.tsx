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
import { ContextModalProps } from '@mantine/modals';

import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import StyledSvg from '../common/StyledSvg';
import { RemoveSoftwareFormValues, SoftwareShortcut } from '../../../../@types';
import useModalFormHeight from '../../hooks/useSetModalFormHeight';

const FORM_DEFAULT_VALUES = {
  initialValues: {
    removedSoftwares: [],
  },
};

function RemoveSoftwareModal({ context, id }: ContextModalProps) {
  useModalFormHeight();

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
    context.closeModal(id);
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
              key={key}
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
  );
}

export default RemoveSoftwareModal;
