export class RealDebridAPI {
  private baseUrl: string = "https://api.real-debrid.com";
  private accessToken: string;

  constructor(accessToken: string) {
    if (!accessToken) throw new Error("No access token provided");
    this.accessToken = accessToken;
  }

  async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    authRequired: boolean = true,
    body?: BodyInit,
    headersInit?: HeadersInit
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(authRequired ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      ...headersInit,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (response.status === 401)
      throw new Error("Bad token (expired, invalid)");
    if (response.status === 403)
      throw new Error("Permission denied (account locked, not premium)");
    if (!response.ok)
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );

    return response;
  }
}
