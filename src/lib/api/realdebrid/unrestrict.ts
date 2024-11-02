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
    url: string,
    password?: string
  ): Promise<RealDebridUnrestrictCheck> {
    const body = new URLSearchParams({ link: url });

    if (password) body.set("password", password);

    return this.makeRequest(
      "/rest/1.0/unrestrict/check",
      "POST",
      true,
      body.toString()
    );
  }

  public async link(
    link: string,
    password?: string,
    remote: number = 0
  ): Promise<RealDebridUnrestrictFileFolder> {
    const body = new URLSearchParams({ link, remote: remote.toString() });

    if (password) body.set("password", password);

    return this.makeRequest(
      "/rest/1.0/unrestrict/link",
      "POST",
      true,
      body.toString()
    );
  }

  public async folder(link: string): Promise<RealDebridUnrestrictFileFolder[]> {
    const body = new URLSearchParams({ link });
    return this.makeRequest("/rest/1.0/unrestrict/folder", "POST", true, body, {
      "Content-Type": "application/x-www-form-urlencoded",
    });
  }

  public async containerFile(
    fileId: string
  ): Promise<RealDebridUnrestrictFileFolder[]> {
    const body = new URLSearchParams({ fileId });
    return this.makeRequest(
      "/rest/1.0/unrestrict/containerFile",
      "PUT",
      true,
      body.toString(),
      { "Content-Type": "application/x-www-form-urlencoded" }
    );
  }

  public async containerLink(
    link: string
  ): Promise<RealDebridUnrestrictFileFolder[]> {
    const body = new URLSearchParams({ link });
    return this.makeRequest(
      "/rest/1.0/unrestrict/containerLink",
      "POST",
      true,
      body.toString(),
      { "Content-Type": "application/x-www-form-urlencoded" }
    );
  }
}
