import { appConfigDir } from "@tauri-apps/api/path";
import Database from "@tauri-apps/plugin-sql";

class BaseDatabase {
  lists?: Database;
  private initialized = false;

  async init() {
    console.log({
      test: await appConfigDir(),
    });
    if (this.initialized) return this;
    this.lists = await Database.load("sqlite:lists.db");

    this.initialized = true;
    return this;
  }

  async reset() {
    this.lists = undefined;
    this.initialized = false;
  }

  async reinit() {
    await this.reset();
    await this.init();
  }

  async close() {
    await this.reset();
  }
}

const db = new BaseDatabase();
export { db };
