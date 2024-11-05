export type PluginSearchResponse =
  | {
      type: "magnet" | "torrent";
      seeds: number;
      name: string;
      uploader: string;
      return: string;
      size?: number;
      game_version?: string;
      password?: string;
    }
  | {
      type: "ddl";
      name: string;
      return: string;
      uploader: string;
      size?: number;
      game_version?: string;
      password?: string;
    };
