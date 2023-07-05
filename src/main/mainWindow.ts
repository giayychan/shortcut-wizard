import { BrowserWindow } from 'electron';

class MainWindow {
  private window: BrowserWindow | null;

  private isHidden: boolean;

  constructor() {
    this.window = null;
    this.isHidden = false;
  }

  getWindow(): BrowserWindow | null {
    return this.window;
  }

  setWindow(window: BrowserWindow | null): void {
    this.window = window;
  }

  getIsHidden(): boolean {
    return this.isHidden;
  }

  setIsHidden(isHidden: boolean): void {
    this.isHidden = isHidden;
  }
}

const mainWindow = new MainWindow();

export default mainWindow;
