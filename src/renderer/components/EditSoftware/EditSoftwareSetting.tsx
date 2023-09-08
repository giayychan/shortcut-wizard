import { useListState, useToggle } from '@mantine/hooks';
import {
  Aside,
  Button,
  Checkbox,
  Flex,
  Group,
  ScrollArea,
  ThemeIcon,
  Text,
  ActionIcon,
  Drawer,
} from '@mantine/core';
import { useState } from 'react';
import { IconEdit } from '@tabler/icons-react';
import trpcReact from '../../utils/trpc';
import StyledSvg from '../common/StyledSvg';
import EditSoftware from './EditSoftwareForm';
import { SoftwareShortcut } from '../../../../@types';

export default function EditSoftwareList() {
  const utils = trpcReact.useContext();
  const softwareShortcuts = utils.software.all.getData();

  const [selectedSoftwareShortcut, setSelectedSoftwareShortcut] = useState<
    SoftwareShortcut | undefined
  >();

  const [confirmed, toggle] = useToggle();
  const [isEditSoftware, toggleIsEditSoftware] = useToggle();

  const { mutateAsync: deleteSoftware, isLoading: isDeleting } =
    trpcReact.software.delete.useMutation();

  const data = softwareShortcuts?.map(({ software }) => {
    return {
      label: software.key,
      checked: false,
      key: software.key,
    };
  });

  const [values, handlers] = useListState(data);

  const allChecked = values?.every((value) => value.checked);
  const indeterminate = values?.some((value) => value.checked) && !allChecked;

  const handleClick = (softwareShortcut?: SoftwareShortcut) => {
    toggleIsEditSoftware(true);
    setSelectedSoftwareShortcut(softwareShortcut);
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
              <Text size="md">{value.key}</Text>
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
    }

    toggle();
  };

  return (
    <Aside>
      <Drawer
        withCloseButton={false}
        opened={isEditSoftware}
        onClose={() => toggleIsEditSoftware(false)}
        title={
          selectedSoftwareShortcut
            ? `Edit ${selectedSoftwareShortcut.software.key}`
            : 'Add Software'
        }
        padding="xl"
        size="xl"
        position="right"
        zIndex={10000}
        styles={{
          header: {
            paddingTop: 50,
          },
        }}
      >
        <EditSoftware
          softwareShortcut={selectedSoftwareShortcut}
          close={() => toggleIsEditSoftware(false)}
        />
      </Drawer>
      <Flex direction="column" h="100%" p="md" pt={40}>
        <ScrollArea className="flex-1" offsetScrollbars>
          <Flex direction="column" w="100%">
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
          </Flex>
        </ScrollArea>
        <Flex p="md" gap="xl">
          <Button
            compact
            color="orange"
            disabled={
              (!indeterminate && !allChecked) || !softwareShortcuts?.length
            }
            onClick={handleDelete}
            loading={isDeleting}
          >
            {confirmed ? 'Confirm Delete?' : 'Delete'}
          </Button>
          <Button compact color="indigo" onClick={() => handleClick()}>
            Add new software
          </Button>
        </Flex>
      </Flex>
    </Aside>
  );
}
