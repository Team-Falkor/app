import { SettingsTitleBarStyle } from "@/@types";
import { Website } from "../api/igdb/types";

export const getSteamIdFromUrl = (url: string) =>
  url.match(/\/app\/(\d+)(\/|$)/)?.[1];

export const getSteamIdFromWebsites = (websites: Website[]) => {
  const find_steam_url = websites?.find((site) =>
    site.url.startsWith("https://store.steampowered.com/app")
  );

  if (!find_steam_url) return undefined;

  return getSteamIdFromUrl(find_steam_url?.url);
};

export const createSlug = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const shouldHideTitleBar = (titleBarStyle: SettingsTitleBarStyle) => {
  return ["none", "native"].includes(titleBarStyle);
};
