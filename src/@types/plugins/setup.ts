export type PluginId = `${string}.${string}.${string}` | `${string}.${string}`;

export interface PluginSetupJSON {
  id: string;
  version: string;
  config: false | PluginConfig;
  "multiple-choice": boolean;
  name: string;
  description: string;
  logo: string;
  banner?: string;
  api_url: string;
  author?: {
    name?: string;
    url?: string;
  };
}

export type PluginSetupJSONDisabled = PluginSetupJSON & {
  disabled: boolean;
};

export interface PluginConfig {
  search?: string[];
}
