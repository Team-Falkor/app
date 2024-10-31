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

    // Check if token is valid in memory
    if (this.clientAccessToken && Date.now() < this.tokenExpiration) {
      return this.clientAccessToken;
    }

    // Retrieve cached token and expiration from localStorage
    const cachedAccessToken = localStorage.getItem("igdb_access_token");
    const cachedTokenExpiration = Number(
      localStorage.getItem("igdb_token_expiration")
    );

    // Check if cached token is valid
    if (cachedAccessToken && cachedTokenExpiration > Date.now()) {
      console.log("Using cached access token");
      this.clientAccessToken = cachedAccessToken;
      this.tokenExpiration = cachedTokenExpiration;
      return this.clientAccessToken;
    }

    // If cached token is expired, clear it from localStorage
    if (cachedTokenExpiration <= Date.now()) {
      localStorage.removeItem("igdb_access_token");
      localStorage.removeItem("igdb_token_expiration");
    }

    this.gettingAccessToken = true;

    try {
      // Fetch a new token
      console.log("Fetching a new access token...");
      const response = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
        { method: "POST" }
      ).then((res) => res.json());

      const accessToken = response.access_token;
      const expiration = Date.now() + response.expires_in * 1000; // Expiration in ms

      // Store token in memory and localStorage
      this.clientAccessToken = accessToken;
      this.tokenExpiration = expiration;
      localStorage.setItem("igdb_access_token", accessToken);
      localStorage.setItem("igdb_token_expiration", expiration.toString());

      return this.clientAccessToken;
    } finally {
      this.gettingAccessToken = false;
    }
  }

  // Method to check and renew token if needed
  checkAndRenewToken = async () => {
    if (Date.now() >= (this.tokenExpiration || 0) - 100) {
      await this.getAccessToken();
    }
  };

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
