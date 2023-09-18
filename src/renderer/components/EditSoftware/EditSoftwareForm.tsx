import { nanoid } from 'nanoid';
import { useForm } from '@mantine/form';
import { Group, Box, Button, TextInput, Checkbox } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useSearchParams } from 'react-router-dom';

import StyledSvg from '../common/StyledSvg';
import AutoCompleteInput from './AutoCompleteInput';
import { AddSoftwareFormValues, SoftwareShortcut } from '../../../../@types';
import UploadCustomIcon from './UploadCustomIcon';
import trpcReact from '../../utils/trpc';
import { notifyClientInfo } from '../../utils';

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
}: {
  softwareShortcut: SoftwareShortcut | undefined;
}) {
  const isNew = !softwareShortcut;
  const [searchParams, setSearchParams] = useSearchParams();

  const utils = trpcReact.useContext();
  const { mutateAsync: addSoftware } =
    trpcReact.software.create.software.useMutation();

  const { mutateAsync: updateSoftware } =
    trpcReact.software.update.useMutation();

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

  const [isLoading, { close: stopLoading, open: setLoading }] =
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
    setLoading();

    const createdDate =
      softwareShortcut?.createdDate || new Date().toISOString();

    const newSoftware = {
      createdDate,
      software: values.software,
      shortcuts: values.shortcuts,
    };

    try {
      if (isNew) {
        const templates = utils.software.create.options.getData();
        const template = templates?.find(
          (t) => t.software.id === newSoftware.software.id
        );

        newSoftware.software.key =
          template?.software.key || newSoftware.software.key;

        await addSoftware(newSoftware);
        notifyClientInfo('Software added');
      } else {
        await updateSoftware({
          ...newSoftware,
          software: {
            ...newSoftware.software,
            key: softwareShortcut.software.key,
          },
        });
        notifyClientInfo('Software updated');
      }
      await utils.software.all.refetch();
      handleClear();

      const from = searchParams.get('from');
      searchParams.delete('softwareKey');
      searchParams.delete('from');
      if (from === 'modal') setSearchParams({ modalTab: 'Edit Software' });
      else if (from === 'main') modals.closeAll();
      else await utils.software.create.options.refetch();
    } catch (error: any) {
      form.setFieldError('software.label', error.message);
    } finally {
      stopLoading();
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
        <Button variant="filled" type="submit" loading={isLoading}>
          Confirm
        </Button>
      </Group>
    </Box>
  );
}

export default EditSoftware;
