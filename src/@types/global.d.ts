import { fetch } from "@tauri-apps/plugin-http";
import * as FalkorSDK from "@team-falkor/sdk";

declare global {
  interface Window {
    FalkorSDK: typeof FalkorSDK;
    FalkorFetch: typeof fetch;
  }
}

export {};
