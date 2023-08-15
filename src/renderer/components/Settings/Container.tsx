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
    <div className="flex">
      <SettingsMenu toggle={toggle} opened={opened}>
        {selectedSoftwareShortcut ? (
          <div className="border border-red-500 w-full h-full bg-transparent">
            <AddShortcutButton />
            <RemoveShortcutButton />
          </div>
        ) : (
          <div className="border border-blue-500 p-2 w-full h-full bg-transparent relative top-0 left-0">
            <AddSoftwareButton />
            <RemoveSoftwareButton />
            <FactoryResetButton toggle={toggle} />
            <SignInButton />
          </div>
        )}
      </SettingsMenu>
    </div>
  );
}

export default SettingContainer;
