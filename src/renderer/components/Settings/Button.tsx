import { ActionIcon } from '@mantine/core';
import { openContextModal } from '@mantine/modals';
import { IconSettings } from '@tabler/icons-react';

function SettingsButton() {
  return (
    <ActionIcon
      onClick={() => {
        openContextModal({
          modal: 'openSettings',
          fullScreen: true,
          withCloseButton: false,
          innerProps: { selectedSettingsTab: 0 },
        });
      }}
      title="Settings"
      color="gray.5"
      size="md"
      ml="auto"
      mr="xs"
    >
      <IconSettings />
    </ActionIcon>
  );
}

export default SettingsButton;
