import { RealDebridTorrentInfo } from "@/@types/accounts";
import { RealDebridAPI } from "./models/api";

export class Torrents extends RealDebridAPI {
  constructor(accessToken: string) {
    super(accessToken);
  }

  public async info(torrentId: string): Promise<RealDebridTorrentInfo> {
    return this.makeRequest<RealDebridTorrentInfo>(
      `/rest/1.0/torrents/info/${torrentId}`,
      "GET",
      true
    );
  }

  public async instantAvailability(
    torrentHash: string
  ): Promise<Record<string, unknown>> {
    return this.makeRequest(
      `/rest/1.0/torrents/instantAvailability/${torrentHash}`,
      "GET",
      true
    );
  }

  public async activeCount(): Promise<number> {
    return this.makeRequest<number>(
      "/rest/1.0/torrents/activeCount",
      "GET",
      true
    );
  }

  public async availableHosts(): Promise<
    Array<{ host: string; max_file_size: number }>
  > {
    return this.makeRequest("/rest/1.0/torrents/availableHosts", "GET", true);
  }

  public async add(host: string): Promise<{ id: string; uri: string }> {
    return this.makeRequest(
      "/rest/1.0/torrents/add",
      "PUT",
      true,
      JSON.stringify({ host })
    );
  }

  public async addMagnet(
    magnet: string,
    host?: string
  ): Promise<{ id: string; uri: string }> {
    return this.makeRequest(
      "/rest/1.0/torrents/addMagnet",
      "POST",
      true,
      JSON.stringify({ magnet, host })
    );
  }

  public async selectFiles(torrentId: string, files: string): Promise<boolean> {
    await this.makeRequest(
      `/rest/1.0/torrents/selectFiles/${torrentId}`,
      "POST",
      true,
      new URLSearchParams({ files })
    );
    return true;
  }

  public async delete(torrentId: string): Promise<boolean> {
    await this.makeRequest(
      `/rest/1.0/torrents/delete/${torrentId}`,
      "DELETE",
      true
    );
    return true;
  }
}
