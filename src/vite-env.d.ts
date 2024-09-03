/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TWITCH_CLIENT_ID: string;
  readonly VITE_TWITCH_CLIENT_SECRET: string;
  readonly VITE_ITAD_API_KEY: string;
  readonly VITE_RD_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
