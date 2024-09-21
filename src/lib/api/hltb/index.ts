import { formatName } from "@/lib/helpers/formatName";
import { load } from "cheerio";
import { BaseApi } from "../base";

let instance: HLTB | null = null;

export class HLTB extends BaseApi {
  private searchKey: string | null = null;

  public static BASE_URL: string = "https://howlongtobeat.com/";
  public static DETAIL_URL: string = `${HLTB.BASE_URL}game?id=`;
  public static SEARCH_URL: string = `${HLTB.BASE_URL}api/search/`;
  public static IMAGE_URL: string = `${HLTB.BASE_URL}games/`;

  constructor() {
    super();
    instance ||= this;
    return instance;
  }

  private static readonly SEARCH_KEY_PATTERN =
    /"\/api\/search\/".concat\("([a-zA-Z0-9]+)"\)/g;

  async search(query: string, retry = true): Promise<HLTBSearchGameData> {
    this.searchKey ||= await this.getSearchKey();
    const searchUrlWithKey = HLTB.SEARCH_URL + this.searchKey;

    const body = JSON.stringify({
      searchType: "games",
      searchTerms: formatName(query).split(" "),
      searchPage: 1,
      size: 100,
    });

    try {
      const res = await this.makeReq(searchUrlWithKey, {
        method: "POST",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 6.0; XT1069 Build/MPB24.65-34-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.105 Mobile Safari/537.36",
          origin: "https://howlongtobeat.com",
          referer: "https://howlongtobeat.com",
        },
        body: body,
      });

      if (res.status === 404 && retry) {
        this.searchKey = null;
        return this.search(query, false);
      }

      if (res.status !== 200) {
        throw new Error(`Got non-200 status code from howlongtobeat.com [${
          res.status
        }]
          ${res.statusText}
        `);
      }

      const data: HLTBSearchGameData = await res.json();

      return data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
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
