/* eslint-disable react/jsx-props-no-spreading */
import { forwardRef, useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Divider,
  Group,
  Text,
} from '@mantine/core';
import { IconSquarePlus } from '@tabler/icons-react';

import StyledSvg from '../common/StyledSvg';
import {
  AddSoftwareAutocompleteItemProps,
  AddSoftwareAutocompleteOption,
  AutoCompleteProps,
} from '../../../../@types';

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
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    AddSoftwareAutocompleteOption[]
  >([]);

  const fetchSoftwareAutoCompleteOptions = async () => {
    const { ipcRenderer } = window.electron;

    const res = await ipcRenderer.invoke(
      'fetchSoftwareAutoCompleteOptions',
      undefined
    );
    setAutoCompleteOptions(res);
  };

  useEffect(() => {
    fetchSoftwareAutoCompleteOptions();
  }, []);

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
    const { isCustom, filename } = item.software.icon;

    form.setFieldValue('software.icon.isCustom', isCustom);
    form.setFieldValue('software.icon.filename', filename);

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
    />
  );
}

export default AutoCompleteInput;
