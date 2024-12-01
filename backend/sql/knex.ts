import { app } from "electron";
import knexClass from "knex";
import { constants } from "../utils";

export const db = knexClass({
  debug: Boolean(process.env?.debug) ?? !app.isPackaged,
  client: "better-sqlite3",
  connection: {
    filename: constants.databasePath,
  },
  useNullAsDefault: true,
});
