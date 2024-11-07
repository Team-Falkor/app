import { app } from "electron";
import electronUpdater from "electron-updater";
import { settings } from "../../utils/settings/settings";

const { autoUpdater } = electronUpdater;

class Updater {
  private settings = settings;
  private updateAvailable = false;

  public async checkForUpdates() {
    if (!this.settings.get("autoCheckForUpdates")) return null;
    const check = await autoUpdater.checkForUpdates();

    if (!check) return false;

    // Return true if update is available
    if (check.updateInfo.version === app.getVersion()) return false;

    this.updateAvailable = true;
    return true;
  }

  public async downloadUpdate() {
    const updateAvailable = await this.checkForUpdates();
    if (!updateAvailable) return false;
    return await autoUpdater.downloadUpdate();
  }

  public quitAndInstall() {
    if (!this.updateAvailable) return false;
    return autoUpdater.quitAndInstall();
  }

  public async update() {
    await this.downloadUpdate();
    return this.quitAndInstall();
  }
}

export default new Updater();
