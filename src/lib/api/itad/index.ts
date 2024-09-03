import { ClientOptions } from "@tauri-apps/plugin-http";
import { BaseApi } from "../base";
import {
  ITADGameInfo,
  ITADGameLookup,
  ITADGameSearch,
  ITADPrice,
} from "./types";

const { VITE_ITAD_API_KEY } = import.meta.env;

class ITAD extends BaseApi {
  protected readonly baseUrl: string = "https://api.isthereanydeal.com";
  protected readonly apiKey: string;

  constructor() {
    super();
    if (!VITE_ITAD_API_KEY)
      throw new Error("VITE_ITAD_API_KEY is not set, cannot use ITAD");
    this.apiKey = VITE_ITAD_API_KEY ?? "";
  }

  async gameSearch(query: string): Promise<ITADGameSearch[]> {
    const response = await this.request(
      "games/search/v1",
      {
        method: "GET",
      },
      {
        title: query,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data: ITADGameSearch[] = await response.json();

    return data;
  }

  async gameLookup(id: string | number): Promise<ITADGameLookup> {
    const response = await this.request(
      "games/lookup/v1",
      { method: "GET" },
      typeof id === "string" ? { title: id } : { appid: id.toString() }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data: ITADGameLookup = await response.json();

    return data;
  }

  async gameInfo(id: string): Promise<ITADGameInfo> {
    const response = await this.request(
      "games/info/v2",
      { method: "GET" },
      { id: id }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data: ITADGameInfo = await response.json();

    return data;
  }

  async gamePrices(id: string[], country = "US"): Promise<ITADPrice[]> {
    const response = await this.request(
      "games/prices/v2",
      {
        method: "POST",
        body: JSON.stringify(id),
      },
      {
        country: country,
        capacity: "8",
        nondeals: "true",
        vouchers: "true",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data: ITADPrice[] = await response.json();

    return data;
  }

  async request(
    url: string,
    options: ClientOptions & RequestInit,
    params: Record<string, string> = {}
  ): Promise<Response> {
    try {
      const real_url = new URL(url, this.baseUrl);
      real_url.searchParams.set("key", this.apiKey);

      for (const [key, value] of Object.entries(params)) {
        real_url.searchParams.set(key, value);
      }

      return await this.makeReq(real_url.href, options);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to fetch ${url}: ${error}`);
    }
  }
}

const itad = new ITAD();
export { itad };
