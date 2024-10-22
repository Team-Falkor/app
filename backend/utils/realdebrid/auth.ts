export class RealDebridAuth {
  // The OAuth URL used to obtain device and user codes
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
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(`Failed to obtain device code: ${response.statusText}`);

    const data: {
      device_code: string;
      user_code: string;
      interval: string;
      expires_in: string;
      verification_url: string;
    } = await response.json();

    console.log(
      `Please go to ${data.verification_url} and enter the code: ${data.user_code}`
    );

    return data;
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
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.text();
        const parsed = JSON.parse(data);

        this.clientId = parsed.client_id;
        this.clientSecret = parsed.client_secret;

        return parsed;
      }
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    }

    throw new Error("Timeout while waiting for user authorization.");
  }

  // Step 3: Obtain access token

  public async obtainAccessToken(deviceCode: string) {
    const url = `${this.oauthUrl}/token`;
    const body = `client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${deviceCode}&grant_type=http://oauth.net/grant_type/device/1.0`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok)
      throw new Error(`Failed to obtain access token: ${response.statusText}`);

    const data: {
      access_token: string;
      expires_in: string;
      token_type: string;
      refresh_token: string;
    } = await response.json();

    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;

    return data;
  }

  // Step 4: Refresh the access token
  public async refreshAccessToken() {
    const url = `${this.oauthUrl}/token`;
    const body = `client_id=${this.clientId}&client_secret=${this.clientSecret}&refresh_token=${this.refreshToken}&grant_type=refresh_token`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok)
      throw new Error(`Failed to refresh access token: ${response.statusText}`);

    const data = await response.json();
    this.accessToken = data.access_token;

    // Update the refreshToken in case the API returns a new one
    this.refreshToken = data.refresh_token;
    return data;
  }
}

let instance: RealDebridAuth | null = null;

export const getRealDebridAuthInstance = (): RealDebridAuth => {
  if (!instance) {
    instance = new RealDebridAuth();
  }
  return instance;
};
