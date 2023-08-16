import AddShortcutModal from '../AddShortcut/Modal';
import AddSoftwareModal from '../AddSoftware/Modal';
import RemoveShortcutModal from '../RemoveShortcut/Modal';
import RemoveSoftwareModal from '../RemoveSoftware/Modal';
import SettingsModal from '../Settings/Modal';

const modals = {
  addSoftware: AddSoftwareModal,
  removeSoftware: RemoveSoftwareModal,
  addShortcut: AddShortcutModal,
  removeShortcut: RemoveShortcutModal,
  openSettings: SettingsModal,
};

export default modals;
