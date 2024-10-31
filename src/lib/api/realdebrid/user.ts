import { RealDebridTorrent, RealDebridUser } from "@/@types/accounts";
import { RealDebridAPI } from "./models/api";

export class User extends RealDebridAPI {
  constructor(accessToken: string) {
    super(accessToken);
  }

  public async getUserInfo(): Promise<RealDebridUser> {
    return this.makeRequest<RealDebridUser>("/rest/1.0/user", "GET", true);
  }

  public async torrents(
    offset?: number,
    page?: number,
    limit: number = 50,
    filter: string = "active"
  ): Promise<RealDebridTorrent[]> {
    const url = new URL("/rest/1.0/torrents");
    if (offset) url.searchParams.append("offset", offset.toString());
    if (page) url.searchParams.append("page", page.toString());
    if (limit) url.searchParams.append("limit", limit.toString());
    if (filter) url.searchParams.append("filter", filter);

    return this.makeRequest<RealDebridTorrent[]>(url.href, "GET", true);
  }
}
