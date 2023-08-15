import { ActionIcon } from '@mantine/core';
import { openContextModal } from '@mantine/modals';
import { IconSettings } from '@tabler/icons-react';

function SettingsButton() {
  const title = 'Settings';

  return (
    <ActionIcon
      onClick={() => {
        openContextModal({
          title,
          modal: 'openSettings',
          innerProps: {},
        });
      }}
      title="Settings"
      color="gray.5"
    >
      <div className="mb-2">
        <IconSettings size="lg" />
      </div>
    </ActionIcon>
  );
}

export default SettingsButton;
