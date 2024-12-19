import { constants } from "backend/utils";

export interface IGetSchemaForGame {
  game: Game;
}

export interface Game {
  gameName: string;
  gameVersion: string;
  availableGameStats: AvailableGameStats;
}

export interface AvailableGameStats {
  achievements: Achievement[];
}

export interface Achievement {
  name: string;
  defaultvalue: number;
  displayName: string;
  hidden: number;
  icon: string;
  icongray: string;
  description?: string;
}

class AchievementData {
  readonly api_url: string | undefined = constants.apiUrl;

  async get(steamId: string, lang: string = "en"): Promise<IGetSchemaForGame> {
    try {
      const url = `${this.api_url}/achievements/${steamId}?lang=${lang}`;

      const request = await fetch(url, {
        method: "GET",
      });

      if (!request.ok) throw new Error(request.statusText);

      const data: IGetSchemaForGame = await request.json();

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const achievementData = new AchievementData();
