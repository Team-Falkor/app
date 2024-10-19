export type PluginSearchResponse =
  | {
      type: "magnet" | "torrent";
      seeds: number;
      name: string;
      uploader: string;
      return: string;
      size?: number;
    }
  | {
      type: "ddl";
      name: string;
      url: string;
      size: number;
    };
