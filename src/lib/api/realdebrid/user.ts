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
    filter?: string
  ): Promise<RealDebridTorrent[]> {
    const searchParams = new URLSearchParams();
    if (offset) searchParams.append("offset", offset.toString());
    if (page) searchParams.append("page", page.toString());
    if (limit) searchParams.append("limit", limit.toString());
    if (filter) searchParams.append("filter", filter);

    const url = `/rest/1.0/torrents?${searchParams}`;

    return this.makeRequest<RealDebridTorrent[]>(url, "GET", true);
  }
}
