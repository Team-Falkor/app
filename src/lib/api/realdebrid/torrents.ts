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
    const body = new URLSearchParams({ host });
    return this.makeRequest(
      "/rest/1.0/torrents/add",
      "PUT",
      true,
      body.toString()
    );
  }

  public async addMagnet(magnet: string): Promise<{ id: string; uri: string }> {
    const body = new URLSearchParams({ magnet: magnet });

    return await this.makeRequest(
      "/rest/1.0/torrents/addMagnet",
      "POST",
      true,
      body.toString()
    );
  }

  public async selectFiles(
    torrentId: string,
    files: string | "all"
  ): Promise<boolean> {
    const body = new URLSearchParams({ files });
    await this.makeRequest(
      `/rest/1.0/torrents/selectFiles/${torrentId}`,
      "POST",
      true,
      body.toString()
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
