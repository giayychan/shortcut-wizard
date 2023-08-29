import { ActionIcon } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { openContextModal } from '@mantine/modals';
import { Shortcut } from '../../../../@types';
import useEditShortcutStore from '../../stores/useEditShortcutStore';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';

type Props = { shortcut: Shortcut };

function EditButton({ shortcut }: Props) {
  const [setOpened, setShortcutId, setSoftwareKey] = useEditShortcutStore(
    (state) => [state.setOpened, state.setShortcutId, state.setSoftwareKey]
  );

  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const handleClick = () => {
    openContextModal({
      modal: 'openSettings',
      fullScreen: true,
      withCloseButton: false,
      innerProps: {
        selectedSettingsTab: 3,
      },
    });
    setOpened(true);
    setShortcutId(shortcut.id);
    if (selectedSoftwareShortcut?.software.key)
      setSoftwareKey(selectedSoftwareShortcut?.software.key);
  };

  return (
    <ActionIcon size="sm" onClick={handleClick} color="gray.6">
      <IconEdit />
    </ActionIcon>
  );
}

export default EditButton;
