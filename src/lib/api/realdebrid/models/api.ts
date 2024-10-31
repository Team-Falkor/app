import { invoke } from "@/lib/utils";

export class RealDebridAPI {
  private baseUrl: string = "https://api.real-debrid.com";
  private accessToken: string;

  constructor(accessToken: string) {
    if (!accessToken) throw new Error("No access token provided");
    this.accessToken = accessToken;
  }

  async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    authRequired: boolean = true,
    body?: BodyInit,
    headersInit?: HeadersInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(authRequired ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      ...headersInit,
    };

    const response = await invoke<{
      success: boolean;
      data?: T;
      error?: string;
    }>("request", url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Check response success
    if (!response?.success) {
      switch (response?.error) {
        case "Unauthorized":
          throw new Error("Bad token (expired, invalid)");
        case "Forbidden":
          throw new Error("Permission denied (account locked, not premium)");
        default:
          throw new Error(
            `API request failed: ${response?.error || "Unknown error"}`
          );
      }
    }

    if (!response.data) throw new Error("No data returned from API");

    return response.data;
  }
}
