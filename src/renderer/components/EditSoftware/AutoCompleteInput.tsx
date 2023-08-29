/* eslint-disable react/jsx-props-no-spreading */
import { forwardRef } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Divider,
  Group,
  Loader,
  Text,
} from '@mantine/core';
import { IconSquarePlus } from '@tabler/icons-react';

import StyledSvg from '../common/StyledSvg';
import {
  AddSoftwareAutocompleteItemProps,
  AutoCompleteProps,
} from '../../../../@types';
import trpcReact from '../../utils/trpc';

const AutoCompleteItem = forwardRef<
  HTMLDivElement,
  AddSoftwareAutocompleteItemProps
>(
  (
    { value, software: { icon }, ...others }: AddSoftwareAutocompleteItemProps,
    ref
  ) => (
    <>
      {!value && <Divider my={2} />}
      <div ref={ref} {...others}>
        <Group noWrap>
          {icon.isCustom ? (
            <IconSquarePlus />
          ) : (
            icon.dataUri && <StyledSvg src={icon.dataUri} />
          )}

          <Text className="capitalize">{value || 'Add a new software'}</Text>
        </Group>
      </div>
    </>
  )
);

function AutoCompleteInput({ form, icon, showNextInput }: AutoCompleteProps) {
  const { data: autoCompleteOptions, isLoading } =
    trpcReact.software.create.options.useQuery();

  if (isLoading) return <Loader />;

  if (!autoCompleteOptions?.length) return null;

  const filterAutoComplete = (currentValue: string, item: AutocompleteItem) => {
    const hasNoValue = !item.value;
    const hasCurrentValue = currentValue && currentValue.trim().length > 0;

    if (hasNoValue) {
      if (hasCurrentValue) {
        const filteredData = autoCompleteOptions.filter(({ value }) =>
          value.toLowerCase().includes(currentValue.toLowerCase().trim())
        );

        return filteredData.length === 0;
      }
      return true;
    }

    const itemValueIncludesCurrent = item.value
      .toLowerCase()
      .includes(currentValue.toLowerCase().trim());

    return itemValueIncludesCurrent;
  };

  const handleItemSubmit = (item: AutocompleteItem) => {
    const { isCustom } = item.software.icon;

    form.setFieldValue('software.icon', item.software.icon);

    if (isCustom) {
      if (form.values.software.key === '') {
        form.setFieldError('software.key', 'Please enter a software name');
        return;
      }
      form.setFieldValue('software.key', form.values.software.key);
      form.setFieldValue('file', null);
      showNextInput();
    } else {
      form.setFieldValue('software.key', item.software.key);
    }
  };

  return (
    <Autocomplete
      {...form.getInputProps('software.key')}
      hoverOnSearchChange
      label="Software Name"
      placeholder="Pick one or add a new one"
      itemComponent={AutoCompleteItem}
      data={autoCompleteOptions}
      filter={filterAutoComplete}
      onItemSubmit={handleItemSubmit}
      icon={icon}
      limit={autoCompleteOptions.length}
      maxDropdownHeight={250}
      data-autofocus
    />
  );
}

export default AutoCompleteInput;
