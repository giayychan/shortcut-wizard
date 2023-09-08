import { nanoid } from 'nanoid';
import { useForm } from '@mantine/form';
import {
  Group,
  Box,
  Button,
  LoadingOverlay,
  TextInput,
  Checkbox,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';

import StyledSvg from '../common/StyledSvg';
import AutoCompleteInput from './AutoCompleteInput';
import { AddSoftwareFormValues, SoftwareShortcut } from '../../../../@types';
import UploadCustomIcon from './UploadCustomIcon';
import trpcReact from '../../utils/trpc';

const FORM_DEFAULT_VALUES = {
  file: null,
  software: {
    id: nanoid(),
    key: '',
    label: '',
    icon: {
      isCustom: false,
      filename: '',
    },
  },
  shortcuts: [],
};

function EditSoftware({
  softwareShortcut,
  close,
}: {
  softwareShortcut: SoftwareShortcut | undefined;
  close: () => void;
}) {
  const isNew = !softwareShortcut;

  const utils = trpcReact.useContext();
  const addSoftware = trpcReact.software.create.software.useMutation();
  const updateSoftware = trpcReact.software.update.useMutation();

  const form = useForm<AddSoftwareFormValues>({
    initialValues: { ...FORM_DEFAULT_VALUES, ...softwareShortcut },
    validate: {
      software: {
        label: (value) => {
          if (value === '') return 'Please enter a software name';
          const regex = /[^a-zA-Z0-9\s]/;
          if (regex.test(value))
            return 'Please enter a valid software name (no special characters)';
          return null;
        },
        icon: {
          filename: (value) => {
            if (value === '') return 'Please upload an icon';
            return null;
          },
        },
      },
      file: (value, values) => {
        if (
          !value &&
          values.software.icon.isCustom &&
          !values.software.icon.filename
        )
          return 'Please upload an icon';
        return null;
      },
    },
    transformValues: (values) => ({
      ...values,
      software: {
        ...values.software,
        key: values.software.label.toLowerCase().replace(/\s/g, '-'),
      },
    }),
  });

  const [visible, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);

  const [active, { toggle: showNextInput }] = useDisclosure(false);

  const {
    file,
    software: { icon },
  } = form.values;

  const handleClear = () => {
    form.reset();
  };

  const handleSubmit = async (values: AddSoftwareFormValues) => {
    openLoading();

    const createdDate =
      softwareShortcut?.createdDate || new Date().toISOString();

    const newSoftware = {
      createdDate,
      software: values.software,
      shortcuts: values.shortcuts,
    };

    try {
      if (isNew) {
        await addSoftware.mutateAsync(newSoftware);
      } else {
        await updateSoftware.mutateAsync(newSoftware);
      }
      await utils.software.all.refetch();
      close();
      modals.closeAll();
    } catch (error: any) {
      form.setFieldError('software.label', error.message);
    } finally {
      closeLoading();
    }
  };

  const customIcon = (
    <StyledSvg src={file ? URL.createObjectURL(file) : icon.dataUri} />
  );

  return (
    <Box<'form'>
      component="form"
      w="100%"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay visible={visible} overlayBlur={2} />

      {!isNew ? (
        <TextInput
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...form.getInputProps('software.label')}
          data-autofocus
          label="Software Name"
          icon={icon.filename ? customIcon : null}
        />
      ) : (
        <AutoCompleteInput
          form={form}
          icon={icon.filename ? customIcon : null}
          showNextInput={showNextInput}
        />
      )}

      <Checkbox
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('software.icon.isCustom', { type: 'checkbox' })}
        label="Update custom icon"
        my={10}
      />

      {icon.isCustom ? <UploadCustomIcon active={active} form={form} /> : null}

      <Group position="right" mt="xl">
        {isNew && (
          <Button onClick={handleClear} variant="outline">
            Clear
          </Button>
        )}
        <Button variant="filled" type="submit">
          Confirm
        </Button>
        <Button variant="light" onClick={() => close()}>
          Back
        </Button>
      </Group>
    </Box>
  );
}

export default EditSoftware;
