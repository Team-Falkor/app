import * as FalkorSDK from "@falkor/sdk";
import { fetch } from "@tauri-apps/plugin-http";

declare global {
  interface Window {
    FalkorSDK: typeof FalkorSDK;
    FalkorFetch: typeof fetch;
  }
}

export {};
