import { app } from "electron";
import { default as knexConstructor } from "knex";
import { constants } from "../../src/lib/utils";

export const knex = knexConstructor({
  debug: !app.isPackaged,
  client: "better-sqlite3",
  connection: {
    filename: constants.databasePath,
  },
  useNullAsDefault: true,
});
