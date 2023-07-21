import {
  Flex,
  ActionIcon,
  CloseButton,
  Transition,
  Group,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useToggle, useClickOutside } from '@mantine/hooks';

import AddSoftwareButton from '../AddSoftware/Button';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import RemoveSoftwareButton from '../RemoveSoftware/Button';
import AddShortcutButton from '../AddShortcut/Button';
import RemoveShortcutButton from '../RemoveShortcut/Button';

const scaleY = {
  in: { opacity: 1, transform: 'translateX(0%)' },
  out: { opacity: 0, transform: 'translateX(100%)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};

function SettingContainer() {
  const [selectedSoftwareShortcut] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
  ]);
  const [opened, toggle] = useToggle();
  const clickOutsideRef = useClickOutside(() => toggle(false));
  const theme = useMantineTheme();

  return (
    <Flex ml="auto" align="center" justify="flex-end">
      <ActionIcon size="lg" title="Settings" onClick={() => toggle()}>
        <IconSettings />
      </ActionIcon>
      <Transition
        mounted={opened}
        transition={scaleY}
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <Flex
            bg="red"
            ref={clickOutsideRef}
            h="100%"
            w="100%"
            pos="absolute"
            display="flex"
            align="center"
            top={0}
            right={0}
            style={{
              ...styles,
              borderRadius: rem(5),
              background: theme.fn.linearGradient(
                45,
                theme.colors.blue[9],
                theme.colors.indigo[9]
              ),
            }}
          >
            {selectedSoftwareShortcut ? (
              <Group spacing="xs">
                <AddShortcutButton />
                <RemoveShortcutButton />
              </Group>
            ) : (
              <Group spacing="xs">
                <AddSoftwareButton />
                <RemoveSoftwareButton />
              </Group>
            )}
            <CloseButton
              size="sm"
              variant="light"
              title="Close settings menu"
              onClick={() => toggle()}
              ml="auto"
              mr={6}
            />
          </Flex>
        )}
      </Transition>
    </Flex>
  );
}

export default SettingContainer;
