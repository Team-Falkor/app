import fs from "fs";
import { join } from "node:path";
import { homedir } from "os";

const appDataPath = join(homedir(), "moe.falkor");
const downloadsPath = join(homedir(), "Downloads");
const settingsPath = join(appDataPath, "settings.json");

if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath);
}

if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath);
}

export const constants = {
  databasePath: join(appDataPath, "database.sqlite"),
  pluginsPath: join(appDataPath, "plugins"),
  themesPath: join(appDataPath, "themes"),
  cachePath: join(appDataPath, "cache"),
  screenshotsPath: join(appDataPath, "screenshots"),
  logsPath: join(appDataPath, "logs.json"),
  appDataPath,
  settingsPath,
  downloadsPath,
};
