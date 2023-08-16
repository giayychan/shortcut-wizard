import { ipcRenderer } from 'electron';
import mainWindow from 'main/mainWindow';

function TitleBar() {
  // const renderer = ipcRenderer.invoke;
  const window = mainWindow.getWindow();
  // window.ipcRender.send('window:minimize');

  // window.ipcRender.send('window:restore');

  // window.ipcRender.send('window:maximize');

  // window.ipcRender.send('window:close');

  function CloseWindow() {
    console.log('close');
    const close = window?.ipcRenderer.send('window:close');
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
          className="hover:text-blue-500 cursor-pointer"
          type="button"
          onClick={CloseWindow}
        >
          <svg
            className="titlebutton"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="14px"
            width="14px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"
            />
          </svg>
        </button>
        <button
          className="hover:text-blue-500 cursor-pointer"
          type="button"
          onClick={MinimizeWindow}
        >
          <svg
            className="titlebutton"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="20px"
            width="20px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 8v1H3V8h11z" />
          </svg>
        </button>
        <button
          className="hover:text-blue-500 cursor-pointer"
          type="button"
          onClick={MaximizeWindow}
        >
          <svg
            className="titlebutton"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="16px"
            width="16px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z" />
          </svg>
        </button>
      </div>
      <button
        id="button"
        type="button"
        className="w-full h-full flex items-center justify-end cursor-pointer hover:text-blue-500"
      >
        <p className="titlebutton">Shortcut Wizard</p>
      </button>
    </div>
  );
}

export default TitleBar;
