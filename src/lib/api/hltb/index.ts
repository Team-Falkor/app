import { formatName } from "@/lib/helpers/formatName";
import { fetch } from "@tauri-apps/plugin-http";
import { load } from "cheerio";
import { BaseApi } from "../base";

export class HLTB extends BaseApi {
  public static BASE_URL: string = "https://howlongtobeat.com/";
  public static DETAIL_URL: string = `${this.BASE_URL}game?id=`;
  public static SEARCH_URL: string = `${this.BASE_URL}api/search/`;
  public static IMAGE_URL: string = `${this.BASE_URL}games/`;

  private searchKey: string | undefined;

  private static readonly SEARCH_KEY_PATTERN =
    /"\/api\/search\/".concat\("([a-zA-Z0-9]+)"\)/g;

  async search(query: string) {
    if (!this.searchKey) this.searchKey = await this.getSearchKey();

    const res = await fetch(`${HLTB.SEARCH_URL}${this.searchKey}`, {
      method: "POST",
      body: JSON.stringify({
        searchType: "games",
        searchTerms: formatName(query).split(" "),
        searchPage: 1,
        size: 100,
      }),
      headers: {
        "User-Agent":
          "Chrome: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",

        "content-type": "application/json",
        referer: "https://howlongtobeat.com/",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data: HLTBSearchGameData = await res.json();

    return data;
  }

  private async getSearchKey(
    checkAllScripts: boolean = false
  ): Promise<string> {
    const res = await this.makeReq(HLTB.BASE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; XT1069 Build/MPB24.65-34-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.105 Mobile Safari/537.36",
        origin: "https://howlongtobeat.com",
        referer: "https://howlongtobeat.com",
      },
    });

    const html = await res.text();
    const $ = load(html);

    const scripts = $("script[src]");

    for (const el of scripts) {
      const src = $(el).attr("src") as string;

      if (!checkAllScripts && !src.includes("_app-")) {
        continue;
      }

      const scriptUrl = HLTB.BASE_URL + src;

      try {
        const res = await this.makeReq(scriptUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 6.0; XT1069 Build/MPB24.65-34-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.105 Mobile Safari/537.36",
            origin: "https://howlongtobeat.com",
            referer: "https://howlongtobeat.com",
          },
        });

        const scriptText = await res.text();
        const matches = [...scriptText.matchAll(HLTB.SEARCH_KEY_PATTERN)];
        return matches[0][1];
      } catch (error) {
        continue;
      }
    }

    throw new Error("Could not find search key");
  }
}
