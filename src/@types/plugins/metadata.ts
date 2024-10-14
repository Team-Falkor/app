export interface PluginMetadataResponse {
  id: PluginId;
  name: string;
  version: string;
  description: string;
  image: string;
  background?: string;
  creator?: Array<PluginMetadataCreator>;
}

export type PluginId = `${string}.${string}.${string}` | `${string}.${string}`;

export interface PluginMetadataCreator {
  name: string;
  url?: string;
  image?: string;
  github?: PluginMetadataCreatorGithub;
}

export interface PluginMetadataCreatorGithub {
  username: string;
  url: string;
}
