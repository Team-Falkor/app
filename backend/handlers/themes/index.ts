import fs from "node:fs";
import path from "node:path";
import { ThemeResponse } from "../../@types";
import { constants } from "../../utils";

class Themes {
  private themes_location = constants.themesPath;

  public install = async (url: string): Promise<ThemeResponse> => {
    try {
      const fetchThemeJSON = await fetch(url);
      const themeJSON = await fetchThemeJSON.json();

      if (!themeJSON.name?.length || !themeJSON.theme_path?.length) {
        return {
          success: false,
          message: "Theme name or theme path is missing",
        };
      }

      const fetchTheme = await fetch(themeJSON.theme_path);
      const buffer = await fetchTheme.arrayBuffer();
      const bufferString = Buffer.from(buffer).toString("utf8");

      const themePath = path.join(this.themes_location, themeJSON.name);

      if (!fs.existsSync(themePath)) {
        fs.mkdirSync(themePath);
      }

      await fs.promises.writeFile(
        path.join(themePath, "theme.css"),
        bufferString
      );

      await fs.promises.writeFile(
        path.join(themePath, "theme.json"),
        JSON.stringify(themeJSON, null, 2)
      );

      return {
        message: `Theme ${themeJSON.name} installed successfully`,
        success: true,
      };
    } catch (error) {
      console.error(error);

      return {
        message: "Failed to install theme",
        success: false,
      };
    }
  };

  public delete = async (name: string): Promise<ThemeResponse> => {
    try {
      const themePath = path.join(this.themes_location, name);
      if (!fs.existsSync(themePath)) {
        return {
          success: false,
          message: "Theme does not exist",
        };
      }

      fs.rmSync(themePath, { recursive: true });

      return {
        message: `Theme ${name} deleted successfully`,
        success: true,
      };
    } catch (error) {
      console.error(error);

      return {
        message: "Failed to delete theme",
        success: false,
      };
    }
  };

  public list = async (): Promise<string[]> => {
    try {
      const files = fs.readdirSync(this.themes_location);
      return files;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public get = async (name: string): Promise<string> => {
    try {
      const themePath = path.join(this.themes_location, name);
      if (!fs.existsSync(themePath)) {
        return "";
      }

      return themePath;
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
        return "";
      }

      console.error(error);
      throw error;
    }
  };
}

const themes = new Themes();

export { Themes, themes };
