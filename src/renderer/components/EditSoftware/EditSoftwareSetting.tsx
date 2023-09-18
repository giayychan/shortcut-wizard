import { useListState, useToggle } from '@mantine/hooks';
import {
  Button,
  Checkbox,
  Flex,
  Group,
  ScrollArea,
  ThemeIcon,
  Text,
  ActionIcon,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

import { IconEdit } from '@tabler/icons-react';
import trpcReact from '../../utils/trpc';
import StyledSvg from '../common/StyledSvg';
import { SoftwareShortcut, TabType } from '../../../../@types';
import { notifyClientInfo } from '../../utils';

export default function EditSoftwareList({
  setSelected,
}: {
  setSelected: (tab: TabType) => void;
}) {
  const utils = trpcReact.useContext();
  const softwareShortcuts = utils.software.all.getData();

  const [confirmed, toggle] = useToggle();

  const { mutateAsync: deleteSoftware, isLoading: isDeleting } =
    trpcReact.software.delete.useMutation();

  const data = softwareShortcuts?.map(({ software }) => {
    return {
      label: software.label,
      checked: false,
      key: software.key,
    };
  });

  const [values, handlers] = useListState(data);
  const [, setSearchParams] = useSearchParams();

  const allChecked = values?.every((value) => value.checked);
  const indeterminate = values?.some((value) => value.checked) && !allChecked;

  const handleClick = (softwareShortcut?: SoftwareShortcut) => {
    setSelected('Add Software');
    if (softwareShortcut) {
      setSearchParams({
        softwareKey: softwareShortcut.software.key,
        from: 'modal',
      });
    }
  };

  const items = values?.map((value, index) => {
    const selected = softwareShortcuts?.find((softwareShortcut) => {
      return softwareShortcut.software.key === value.key;
    });

    return (
      <Flex align="center" key={value.key}>
        <Checkbox
          mt="xs"
          ml={33}
          label={
            <Group>
              <ThemeIcon color="dark" variant="light">
                {selected ? (
                  <StyledSvg src={selected.software.icon.dataUri} />
                ) : null}
              </ThemeIcon>
              <Text size="md">{value.label}</Text>
            </Group>
          }
          key={value.key}
          checked={value.checked}
          onChange={(event) =>
            handlers.setItemProp(index, 'checked', event.currentTarget.checked)
          }
        />
        <ActionIcon
          ml="auto"
          variant="light"
          onClick={() => handleClick(selected)}
        >
          <IconEdit size="1rem" />
        </ActionIcon>
      </Flex>
    );
  });

  const handleDelete = async () => {
    if (confirmed) {
      const softwareToDelete = values.reduce((acc: string[], curr) => {
        if (curr.checked) {
          acc.push(curr.key);
        }
        return acc;
      }, []);
      await deleteSoftware(softwareToDelete);
      await utils.software.all.refetch();

      handlers.setState((current) => current.filter((value) => !value.checked));
      notifyClientInfo('Software deleted');
    }

    toggle();
  };

  return (
    <>
      <Flex justify="space-between">
        <Text size="xl" mb="lg">
          Edit Software
        </Text>
        <Button
          variant="light"
          disabled={
            (!indeterminate && !allChecked) || !softwareShortcuts?.length
          }
          onClick={handleDelete}
          loading={isDeleting}
        >
          {confirmed ? 'Confirm Delete?' : 'Delete'}
        </Button>
      </Flex>
      <ScrollArea h="100%" offsetScrollbars>
        <Checkbox
          disabled={!softwareShortcuts?.length}
          checked={allChecked}
          indeterminate={indeterminate}
          label="Select All"
          transitionDuration={0}
          onChange={() =>
            handlers.setState((current) =>
              current.map((value) => ({ ...value, checked: !allChecked }))
            )
          }
        />
        {items}
      </ScrollArea>
    </>
  );
}
