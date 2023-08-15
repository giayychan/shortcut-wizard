// import { BrowserWindow } from 'electron';
import mainWindow from 'main/mainWindow';

import CLOSE from '../../../assets/close.svg';
import MINIMIZE from '../../../assets/minimize.svg';
import MAXIMIZE from '../../../assets/maximize.svg';

function TitleBar() {
  // const renderer = ipcRenderer.invoke;
  const window = mainWindow.getWindow();

  function CloseWindow() {
    console.log('close');
    const close = window?.close();
    return close;
    // return window!.on('closed', () => {
    //   mainWindow.setWindow(null);
    //   mainWindow.setIsHidden(false);
    // });
  }

  function MinimizeWindow() {
    console.log('minimize');
    const minimize = window?.minimize();
    try {
      return minimize;
    } catch (error) {
      console.log('minimize failed');
    }
  }

  function MaximizeWindow() {
    console.log('maximize');
    const maximize = window?.maximize();
    return maximize;
  }

  return (
    <div className="titlebar bg-cyan-950 py-3 px-5 h-[20px] flex flex-row items-center justify-center">
      <div className="h-full w-[54px] flex items-center">
        <button
          className="titlebutton invert cursor-pointer"
          type="button"
          onClick={CloseWindow}
        >
          <img src={CLOSE} width="14px" height="14px" alt="close" />
        </button>
        <button
          className="titlebutton invert cursor-pointer"
          type="button"
          onClick={MinimizeWindow}
        >
          <img src={MINIMIZE} width="20px" height="20px" alt="minimize" />
        </button>
        <button
          className="titlebutton invert cursor-pointer"
          type="button"
          onClick={MaximizeWindow}
        >
          <img src={MAXIMIZE} width="16px" height="16px" alt="maximize" />
        </button>
      </div>
      <button
        id="button"
        type="button"
        className="titlebutton w-full h-full flex items-center justify-end cursor-pointer hover:text-blue-500"
      >
        <p className="titlebutton">Shortcut Wizard</p>
      </button>
    </div>
  );
}

export default TitleBar;
