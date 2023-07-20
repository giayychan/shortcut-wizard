import { Flex, ActionIcon, CloseButton } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useToggle } from '@mantine/hooks';

import AddSoftwareContainer from '../AddSoftware/Container';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import RemoveSoftwareContainer from '../RemoveSoftware/Container';

function SettingContainer() {
  const [selectedSoftwareShortcut] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
  ]);

  const [value, toggle] = useToggle();

  return !value ? (
    <Flex bg="red" ml="auto" align="center">
      <ActionIcon
        variant="light"
        size="1.5rem"
        title="Settings"
        onClick={() => toggle()}
      >
        <IconSettings />
      </ActionIcon>
    </Flex>
  ) : (
    <Flex
      bg="yellow"
      w="100%"
      left={0}
      top={0}
      pos="absolute"
      h="2.25rem"
      align="center"
    >
      {selectedSoftwareShortcut ? null : (
        <>
          <AddSoftwareContainer />
          <RemoveSoftwareContainer />
        </>
      )}
      <CloseButton
        title="Close settings menu"
        onClick={() => toggle()}
        ml="auto"
      />
    </Flex>
  );
}

export default SettingContainer;
