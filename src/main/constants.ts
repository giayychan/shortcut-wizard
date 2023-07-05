export const WIDTH = 680;
export const BASE_HEIGHT = 142;
export const MAX_HEIGHT = 480;

export const APP_HOTKEYS = ['Shift', 'Command', 'Space'];

const GAP = 6;
const HEIGHT_WITHOUT_SHORTCUTS = BASE_HEIGHT + GAP;
const COL_HEIGHT = 58;

export const notifyWindowHeight = (shortcutColCount: number) => {
  const updatedHeight =
    HEIGHT_WITHOUT_SHORTCUTS + COL_HEIGHT * shortcutColCount;
  window.electron.ipcRenderer.sendMessage('setWindowHeight', [
    updatedHeight > MAX_HEIGHT ? MAX_HEIGHT : updatedHeight,
  ]);
};

export const mapKeyToReadable = (key: string) => {
  switch (key) {
    case 'Meta':
      return 'cmd';
    case ' ':
      return 'Space';
    default:
      return key;
  }
};
