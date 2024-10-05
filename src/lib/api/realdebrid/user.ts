import { RealDebridAPI } from "./models/api";
import { RealDebridUser, RealDebridTorrent } from "./types";

export class User extends RealDebridAPI {
  constructor(accessToken: string) {
    super(accessToken);
  }

  public getUserInfo = async (): Promise<RealDebridUser> => {
    try {
      const data = await this.makeRequest("/rest/1.0/user", "GET", true);
      return await data.json();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  public async torrents(
    offset?: number,
    page?: number,
    limit: number = 50,
    filter: string = "active"
  ): Promise<Array<RealDebridTorrent>> {
    const url = new URL(`/rest/1.0/torrents`);
    if (offset !== undefined)
      url.searchParams.append("offset", offset.toString());
    if (page !== undefined) url.searchParams.append("page", page.toString());
    if (limit) url.searchParams.append("limit", limit.toString());
    if (filter) url.searchParams.append("filter", filter);

    const response = await this.makeRequest(url.href, "GET", true);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Bad token (expired, invalid)");
      } else if (response.status === 403) {
        throw new Error("Permission denied (account locked)");
      }
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }
}
