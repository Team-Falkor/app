export class BaseApi {
  /**
   * Make an HTTP request.
   * @param {string} url - The request URL.
   * @param {ClientOptions & RequestInit} [options={ method: "GET" }] - The request options.
   * @returns {Promise<Response>} The response from the request.
   * @throws {Error} Throws an error if the request fails.
   */
  async makeReq<T = unknown>(
    url: string,
    options: RequestInit = {
      method: "GET",
    }
  ): Promise<T> {
    try {
      const data = await window.ipcRenderer.invoke("request", url, options);

      return data as T;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to fetch ${url}: ${(error as Error).message}`);
    }
  }
}
