import { getSteamIdFromWebsites } from "@/lib/helpers";
import { BaseApi } from "../base";
import { defaultFields } from "./constants";
import { ApiResponse, IGDBReturnDataType, InfoReturn } from "./types";

const { VITE_TWITCH_CLIENT_ID, VITE_TWITCH_CLIENT_SECRET } = import.meta.env;

class IGDB extends BaseApi {
  private clientId: string = VITE_TWITCH_CLIENT_ID ?? "";
  private clientSecret: string = VITE_TWITCH_CLIENT_SECRET ?? "";
  private clientAccessToken?: string;
  private tokenExpiration: number = 0;

  private gettingAccessToken = false;

  async getAccessToken() {
    if (this.gettingAccessToken) return;
    if (this.clientAccessToken && Date.now() < this.tokenExpiration)
      return this.clientAccessToken;

    this.gettingAccessToken = true;
    const response = await (
      await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
        { method: "POST" }
      )
    ).json();

    console.log(`Getting a new access token`);

    this.gettingAccessToken = false;
    this.clientAccessToken = response.access_token;
    this.tokenExpiration = Date.now() + response.expires_in * 1000; // Convert to milliseconds

    return this.clientAccessToken;
  }

  checkAndRenewToken = async () =>
    !!(Date.now() >= this.tokenExpiration - 100) &&
    (await this.getAccessToken());

  async search(query: string): Promise<IGDBReturnDataType[]> {
    const realQuery = query;
    // const findEasterEgg = searchEasterEggs.find(
    //   (egg) => egg.name === query.toLowerCase()
    // );
    // if (findEasterEgg) realQuery = findEasterEgg.query;

    const data = await this.request<IGDBReturnDataType[]>("games", {
      search: realQuery,
    });

    return data;
  }

  async info(id: string): Promise<InfoReturn> {
    const igdbData = await this.request<IGDBReturnDataType[]>("games", {
      where: `id = ${id}`,
      limit: "1",
    });

    const item = igdbData[0];

    const steam_id = getSteamIdFromWebsites(item.websites);

    const steam = steam_id ? await this.steamStoreInfo(steam_id) : null;

    const returnData: InfoReturn = {
      ...item,
      steam,
    };

    return returnData;
  }

  async mostAnticipated(): Promise<IGDBReturnDataType[]> {
    const DateNow = (new Date().getTime() / 1000).toFixed();
    return await this.request<IGDBReturnDataType[]>("games", {
      sort: "hypes desc",
      where: `platforms.abbreviation = "PC" & hypes != n & first_release_date > ${DateNow} & category = 0`,
    });
  }

  async newReleases(): Promise<IGDBReturnDataType[]> {
    const DateNow = (new Date().getTime() / 1000).toFixed();
    return await this.request<IGDBReturnDataType[]>("games", {
      sort: "first_release_date desc",
      where: `platforms.abbreviation = "PC" & hypes != n & first_release_date < ${DateNow} & category = 0 & version_parent = null`,
    });
  }

  async topRated(): Promise<IGDBReturnDataType[]> {
    return await this.request<IGDBReturnDataType[]>("games", {
      sort: "total_rating desc",
      where: `platforms.abbreviation = "PC" & total_rating != n & total_rating > 85 & hypes > 2 & rating_count > 5 & version_parent = null & category = 0`,
    });
  }

  private async request<T = unknown>(
    reqUrl: "games",
    options: {
      fields?: string[];
      where?: string;
      search?: string;
      sort?: string;
      limit?: string;
      offset?: string;
    }
  ): Promise<T> {
    while (this.gettingAccessToken) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    try {
      await this.checkAndRenewToken();

      // Construct the request body
      let requestBody = "";
      const fields = options.fields || [];
      requestBody += `fields ${[...fields, ...defaultFields].join(",")};`;

      if (options.sort) {
        requestBody += ` sort ${options.sort};`;
      }
      if (options.limit) {
        requestBody += ` limit ${options.limit};`;
      }
      if (options.search) {
        requestBody += ` search "${options.search}";`;
      }
      if (options.where) {
        requestBody += ` where ${options.where};`;
      }

      // Add other options as needed

      const res = await this.makeReq<T>(`https://api.igdb.com/v4/${reqUrl}`, {
        method: "POST",
        headers: {
          "Client-ID": this.clientId,
          Authorization: `Bearer ${this.clientAccessToken}`,
        },
        body: requestBody ? requestBody : undefined,
      });

      return res;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).message);
    }
  }

  async steamStoreInfo(appid: string) {
    try {
      const url = `https://store.steampowered.com/api/appdetails/?appids=${appid}`;
      const res = await this.makeReq<ApiResponse>(url);

      return res[appid];
    } catch (error) {
      console.error(error);
    }
  }
}

const igdb = new IGDB();
export { igdb };
