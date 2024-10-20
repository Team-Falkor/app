import { ITADPrice } from "@/lib/api/itad/types";
import { PluginSearchResponse } from "./plugins";

export type IGDBImageSize =
  | "original"
  | "cover_small"
  | "screenshot_med"
  | "cover_big"
  | "logo_med"
  | "screenshot_big"
  | "screenshot_huge"
  | "thumb"
  | "micro"
  | "720p"
  | "1080p";

export interface Provider {
  label: string;
  value: string;
}

export interface InfoProps {
  error: Error | null;
  isPending: boolean;
}

export interface InfoItadProps {
  itadData: ITADPrice[] | undefined;
  itadPending: boolean;
  itadError: Error | null;
}
export interface infoHLTBProps {
  hltbData: HLTBSearchGameData | undefined;
  hltbPending: boolean;
  hltbError: Error | null;
}

export type NonDefaultSource = {
  url: string;
  type: "magnet" | "torrent" | "ddl";
  title: string;
  name: string;
};

export type ItemDownload = {
  sources: Array<PluginSearchResponse | ITADPrice>;
  name: string;
  id?: string;
};

export interface ListGame {
  game_id: number;
  title: string;
  description?: string;
  image?: string;
  release_date?: string;
  genre?: string;
}

export interface List {
  id: number;
  name: string;
  description?: string;
}

export type SourceType = "magnet" | "torrent" | "ddl";

export type ProtonDBTier =
  | "borked"
  | "platinum"
  | "gold"
  | "silver"
  | "bronze"
  | "pending";

export enum ProtonDBTierColor {
  borked = "#ff0000", // Red
  platinum = "#e5e4e2", // Platinum
  gold = "#ffd700", // Gold
  silver = "#c0c0c0", // Silver
  bronze = "#cd7f32", // Bronze
  pending = "#808080", // Gray
}

export interface ProtonDBSummary {
  bestReportedTier: ProtonDBTier;
  confidence: string;
  score: number;
  tier: ProtonDBTier;
  total: number;
  trendingTier: ProtonDBTier;
}

export type SearchPluginResponse =
  | {
      message: string;
      success: false;
    }
  | {
      data: Array<SearchPlugiData>;
      success: true;
    };

export type SearchPlugiData = {
  id: string;
  name: string;
  sources: PluginSearchResponse[];
};
