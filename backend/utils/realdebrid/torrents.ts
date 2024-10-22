import { RealDebridTorrentInfo } from "@/@types/accounts";
import { RealDebridAPI } from "./models/api";

export class Torrents extends RealDebridAPI {
  constructor(accessToken: string) {
    super(accessToken);
  }

  public async info(torrentId: string): Promise<RealDebridTorrentInfo> {
    const response = await this.makeRequest(
      `/rest/1.0/torrents/info/${torrentId}`,
      "GET",
      true
    );

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

  public async instantAvailability(torrentHash: string): Promise<{
    // Define the expected return type based on the API documentation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: unknown;
  }> {
    const response = await this.makeRequest(
      `/rest/1.0/torrents/instantAvailability/${torrentHash}`,
      "GET",
      true
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Bad token (expired, invalid)");
      } else if (response.status === 403) {
        throw new Error("Permission denied (account locked, not premium)");
      }
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  public async activeCount(): Promise<{
    // Define the expected return type based on the API documentation
  }> {
    const response = await this.makeRequest(
      "/rest/1.0/torrents/activeCount",
      "GET",
      true
    );

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

  public async availableHosts(): Promise<{
    host: string;
    max_file_size: number;
  }> {
    const response = await this.makeRequest(
      "/rest/1.0/torrents/availableHosts",
      "GET",
      true
    );

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

    return await response.json();
  }

  public async add(host: string): Promise<{
    id: string;
    uri: string; // URL of the created ressource
  }> {
    const response = await this.makeRequest(
      `/rest/1.0/torrents/add`,
      "PUT",
      true,
      JSON.stringify({ host })
    );

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Bad Request");
      } else if (response.status === 401) {
        throw new Error("Bad token (expired, invalid)");
      } else if (response.status === 403) {
        throw new Error("Permission denied (account locked, not premium)");
      } else if (response.status === 503) {
        throw new Error("Service unavailable");
      }
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  public async addMagnet(
    magnet: string,
    host?: string
  ): Promise<{
    id: string;
    uri: string; // URL of the created resource
  }> {
    const response = await this.makeRequest(
      `/rest/1.0/torrents/addMagnet`,
      "POST",
      true,
      JSON.stringify({ magnet, host })
    );

    if (!response.ok) {
      // Real-Debrid returns a 400 status code upon bad request,
      // a 401 upon bad token (expired, invalid),
      // a 403 upon permission denied (account locked, not premium),
      // and a 503 upon service unavailable.
      if (response.status === 400) {
        throw new Error("Bad Request");
      } else if (response.status === 401) {
        throw new Error("Bad token (expired, invalid)");
      } else if (response.status === 403) {
        throw new Error("Permission denied (account locked, not premium)");
      } else if (response.status === 503) {
        throw new Error("Service unavailable");
      }
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  public async selectFiles(torrentId: string, files: string): Promise<boolean> {
    const url = `/rest/1.0/torrents/selectFiles/${torrentId}`;

    const body = new URLSearchParams({
      files,
    });

    const response = await this.makeRequest(url, "POST", true, body);

    if (!response.ok) {
      if (response.status === 202) {
        console.log("Action already done");
      } else if (response.status === 400) {
        throw new Error("Bad Request");
      } else if (response.status === 401) {
        throw new Error("Bad token (expired, invalid)");
      } else if (response.status === 403) {
        throw new Error("Permission denied (account locked, not premium)");
      } else if (response.status === 404) {
        throw new Error(
          "Wrong parameter (invalid file id(s)) / Unknown resource (invalid id)"
        );
      }
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    return true;
  }

  public async delete(torrentId: string): Promise<boolean> {
    const url = `/rest/1.0/torrents/delete/${torrentId}`;

    const response = await this.makeRequest(url, "DELETE", true);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Bad token (expired, invalid)");
      } else if (response.status === 403) {
        throw new Error("Permission denied (account locked)");
      } else if (response.status === 404) {
        throw new Error("Unknown resource");
      }
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    // No content to return, just a success status
    return true;
  }
}
