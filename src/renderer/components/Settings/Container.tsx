import { useToggle } from '@mantine/hooks';

import AddSoftwareButton from '../AddSoftware/Button';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import RemoveSoftwareButton from '../RemoveSoftware/Button';
import AddShortcutButton from '../AddShortcut/Button';
import RemoveShortcutButton from '../RemoveShortcut/Button';
import SettingsMenu from './Menu';
import FactoryResetButton from './FactoryResetButton';
import SignInButton from '../Auth/SignInButton';

function SettingContainer() {
  const selectedSoftwareShortcut = useSelectedShortcutsStore(
    (state) => state.selectedSoftwareShortcut
  );

  const [opened, toggle] = useToggle();

  return (
    <SettingsMenu toggle={toggle} opened={opened}>
      {selectedSoftwareShortcut ? (
        <div className="w-full h-full bg-transparent border border-red-500">
          <AddShortcutButton />
          <RemoveShortcutButton />
        </div>
      ) : (
        <div className="relative top-0 left-0 w-full h-full p-2 bg-transparent border border-blue-500">
          <AddSoftwareButton />
          <RemoveSoftwareButton />
          <FactoryResetButton toggle={toggle} />
          <SignInButton />
        </div>
      )}
    </SettingsMenu>
  );
}

export default SettingContainer;
