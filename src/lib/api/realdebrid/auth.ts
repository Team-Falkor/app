import { invoke } from "@/lib/utils";

export class RealDebridAuth {
  private baseUrl: string = "https://api.real-debrid.com";
  private oauthUrl: string = `${this.baseUrl}/oauth/v2`;

  clientId: string;
  clientSecret?: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;

  constructor() {
    this.clientId = "X245A4XAIBGVM";
  }

  // Step 1: Obtain device and user codes
  public async obtainDeviceCode() {
    const url = `${this.oauthUrl}/device/code?client_id=${this.clientId}&new_credentials=yes`;
    const response = await invoke<{
      success: boolean;
      data: {
        device_code?: string;
        user_code?: string;
        interval?: string;
        expires_in?: string;
        verification_url?: string;
      };
      error?: string;
    }>("request", url);

    if (!response || !response.success) {
      throw new Error(response?.error || "Failed to obtain device code");
    }

    console.log(
      `Please go to ${response?.data?.verification_url} and enter the code: ${response?.data?.user_code}`
    );

    return response?.data;
  }

  // Step 2: Poll for user authorization and credentials
  public async pollForCredentials(
    deviceCode: string,
    interval: number,
    expiresIn: number
  ) {
    const startTime = Date.now();
    const timeout = startTime + expiresIn * 1000;
    const url = `${this.oauthUrl}/device/credentials?client_id=${this.clientId}&code=${deviceCode}`;

    while (Date.now() < timeout) {
      const response = await invoke<{
        success: boolean;
        data: {
          client_id?: string;
          client_secret?: string;
        };
        error?: string;
      }>("request", url);

      console.log("Polling...", response?.data);

      if (
        response?.success &&
        response?.data?.client_id &&
        response?.data?.client_secret
      ) {
        this.clientId = response?.data?.client_id;
        this.clientSecret = response?.data?.client_secret;
        return response?.data;
      } else if (response?.error) {
        console.warn("Polling error:", response?.error);
      }

      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    }

    throw new Error("Timeout while waiting for user authorization.");
  }

  // Step 3: Obtain access token
  public async obtainAccessToken(deviceCode: string) {
    const url = `${this.oauthUrl}/token`;
    const body = `client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${deviceCode}&grant_type=http://oauth.net/grant_type/device/1.0`;

    const response = await invoke<{
      success: boolean;
      data: {
        access_token?: string;
        expires_in?: string;
        token_type?: string;
        refresh_token?: string;
      };
      error?: string;
    }>("request", url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (
      !response?.success ||
      !response?.data?.access_token ||
      !response?.data?.refresh_token
    ) {
      throw new Error(response?.error || "Failed to obtain access token");
    }

    this.accessToken = response?.data?.access_token;
    this.refreshToken = response?.data?.refresh_token;

    return response?.data;
  }

  // Step 4: Refresh the access token
  public async refreshAccessToken() {
    const url = `${this.oauthUrl}/token`;
    const body = `client_id=${this.clientId}&client_secret=${this.clientSecret}&refresh_token=${this.refreshToken}&grant_type=refresh_token`;

    const response = await invoke<{
      success: boolean;
      data: {
        access_token?: string;
        refresh_token?: string;
      };
      error?: string;
    }>("request", url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (
      !response?.success ||
      !response?.data?.access_token ||
      !response?.data?.refresh_token
    ) {
      throw new Error(response?.error || "Failed to refresh access token");
    }

    this.accessToken = response?.data?.access_token;
    this.refreshToken = response?.data?.refresh_token;

    return response?.data;
  }
}

let instance: RealDebridAuth | null = null;

export const getRealDebridAuthInstance = (): RealDebridAuth => {
  if (!instance) {
    instance = new RealDebridAuth();
  }
  return instance;
};
