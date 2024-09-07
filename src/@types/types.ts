import { ITADPrice } from "@/lib/api/itad/types";

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

export type ItemDownload =
  | {
      sources: ITADPrice[];
      name: "itad";
    }
  | {
      sources: NonDefaultSource[];
      name: Exclude<string, "itad">;
    };

export interface ListGame {
  gameId: number;
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
