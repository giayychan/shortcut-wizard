import { useForm } from '@mantine/form';
import { ReactSVG } from 'react-svg';
import { Group, Box, Button, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import StyledSvg from '../common/StyledSvg';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';
import AutoCompleteInput from './AutoCompleteInput';
import {
  AddSoftwareFormValues,
  AddSoftwareFormProps,
} from '../../../../@types';
import UploadCustomIcon from './UploadCustomIcon';
import useModalFormHeight from '../hooks/useSetModalFormHeight';

const FORM_DEFAULT_VALUES = {
  initialValues: {
    file: null,
    software: {
      key: '',
      icon: {
        isCustom: false,
        filename: '',
      },
    },
    shortcuts: [],
  },
};

function AddSoftwareForm({ close }: AddSoftwareFormProps) {
  useModalFormHeight();

  const addSoftware = useSoftwareShortcutsStore((state) => state.addSoftware);
  const form = useForm<AddSoftwareFormValues>(FORM_DEFAULT_VALUES);

  const [visible, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);

  const [active, { toggle: showNextInput }] = useDisclosure(false);

  const {
    file,
    software: { key, icon },
  } = form.values;

  const handleClear = () => {
    form.reset();
  };

  const handleCancel = () => {
    handleClear();
    if (close) close();
  };

  const handleSubmit = async (values: AddSoftwareFormValues) => {
    const {
      software: { icon: softwareIcon, key: softwareKey },
    } = values;

    if (!softwareIcon.filename) {
      form.setFieldError('file', 'Please upload an icon');
      return;
    }

    if (!softwareKey) {
      form.setFieldError('software.key', 'Please enter a software name');
      return;
    }

    openLoading();

    const newSoftware = {
      software: values.software,
      shortcuts: values.shortcuts,
    };

    try {
      await addSoftware(newSoftware);
    } catch (error: any) {
      form.setFieldError('software.key', error.message);
    } finally {
      closeLoading();
      handleCancel();
    }
  };

  const customIcon = file ? (
    <ReactSVG
      src={URL.createObjectURL(file)}
      className="[&_.injected-svg]:stroke-steam"
    />
  ) : (
    icon.dataUri && <StyledSvg src={icon.dataUri} />
  );

  return (
    <Box<'form'>
      component="form"
      maw={320}
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay visible={visible} overlayBlur={2} />

      <AutoCompleteInput
        form={form}
        icon={icon.filename ? customIcon : null}
        showNextInput={showNextInput}
      />

      {icon.isCustom && key ? (
        <UploadCustomIcon active={active} form={form} />
      ) : null}

      <Group position="right" mt="xl">
        <Button onClick={handleClear}>Clear</Button>
        <Button variant="outline" type="submit">
          Add
        </Button>

        <Button variant="light" onClick={handleCancel}>
          Cancel
        </Button>
      </Group>
    </Box>
  );
}

export default AddSoftwareForm;
