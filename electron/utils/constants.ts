import fs from "fs";
import { join } from "node:path";
import { homedir } from "os";

const appDataPath = join(homedir(), "falkor");

if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath);
}

export const constants = {
  appDataPath,
  databasePath: join(appDataPath, "database.sqlite"),
};
