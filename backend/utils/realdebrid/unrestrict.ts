import {
  RealDebridUnrestrictCheck,
  RealDebridUnrestrictFileFolder,
} from "@/@types/accounts";
import { RealDebridAPI } from "./models/api";

export class Unrestrict extends RealDebridAPI {
  constructor(accessToken: string) {
    super(accessToken);
  }

  public async check(
    link: string,
    password?: string
  ): Promise<RealDebridUnrestrictCheck> {
    const body = new URLSearchParams({
      link,
      ...(password ? { password } : {}),
    });

    const response = await this.makeRequest(
      "rest/1.0/unrestrict/check",
      "POST",
      false,
      body,
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );

    if (!response.ok)
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );

    if (response.status === 503) throw new Error("File unavailable");

    return response.json();
  }

  public async link(
    link: string,
    password?: string,
    remote: number = 0
  ): Promise<RealDebridUnrestrictFileFolder> {
    const body = new URLSearchParams({
      link,
      ...(password ? { password } : {}),
      remote: remote.toString(),
    });

    const response = await this.makeRequest(
      "rest/1.0/unrestrict/link",
      "POST",
      true,
      body,
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
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

  public async folder(
    link: string
  ): Promise<Array<RealDebridUnrestrictFileFolder>> {
    const body = new URLSearchParams({
      link,
    });

    const response = await this.makeRequest(
      "rest/1.0/unrestrict/folder",
      "POST",
      true,
      body,
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
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

  public async containerFile(
    fileId: string
  ): Promise<Array<RealDebridUnrestrictFileFolder>> {
    const body = new URLSearchParams({
      fileId,
    });

    const response = await this.makeRequest(
      "rest/1.0/unrestrict/containerFile",
      "PUT",
      true,
      body,
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
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

  public async containerLink(
    link: string
  ): Promise<Array<RealDebridUnrestrictFileFolder>> {
    const body = new URLSearchParams({
      link,
    });

    const response = await this.makeRequest(
      "rest/1.0/unrestrict/containerLink",
      "POST",
      true,
      body,
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
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
}
