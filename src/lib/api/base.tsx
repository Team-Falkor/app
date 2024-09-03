import { ClientOptions, fetch } from "@tauri-apps/plugin-http";

export class BaseApi {
  async makeReq(
    url: string,
    options: ClientOptions & RequestInit = {
      method: "GET",
    }
  ): Promise<Response> {
    try {
      return await fetch(url, options);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to fetch ${url}: ${error}`);
    }
  }
}
