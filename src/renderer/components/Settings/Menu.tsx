import { ActionIcon, CloseButton, Flex, Transition } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { ReactNode, SetStateAction } from 'react';

const transitionProps = {
  in: { opacity: 1, transform: 'translateX(0%)' },
  out: { opacity: 0, transform: 'translateX(100%)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};

function SettingsMenu({
  children,
  toggle,
  opened,
}: {
  children: ReactNode;
  toggle: (value?: SetStateAction<boolean> | undefined) => void;
  opened: boolean;
}) {
  const clickOutsideRef = useClickOutside(() => toggle(false));

  return (
    <Flex ml="auto" align="center" justify="flex-end" mt={4}>
      <ActionIcon
        size="lg"
        title="Settings"
        onClick={() => toggle()}
        color="gray.6"
      >
        <IconSettings />
      </ActionIcon>
      <Transition mounted={opened} transition={transitionProps}>
        {(styles) => (
          <Flex
            ref={clickOutsideRef}
            h="100%"
            w="100%"
            pos="absolute"
            display="flex"
            align="center"
            top={0}
            right={0}
            bg="dark.7"
            style={{
              ...styles,
              zIndex: 99,
            }}
          >
            {children}
            <CloseButton
              size="md"
              variant="filled"
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

export default SettingsMenu;
