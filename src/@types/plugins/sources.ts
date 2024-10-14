import { SourceType } from "../types";

export interface PluginSourcesResponse {
  id: string;
  title: string;
  release_date: string;
  genres?: string[];

  sources: Array<PluginSource>;
}

export interface PluginSource {
  type: SourceType;
  url: string;
  headers?: Record<string, string>;
}
