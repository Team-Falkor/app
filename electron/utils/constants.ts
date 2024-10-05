import { app } from "electron";
import { join } from "node:path";

const appDataPath = join(app.getPath("userData"), "falkor");

export const constants = {
  appDataPath,
  databasePath: join(appDataPath, "database.sqlite"),
};
