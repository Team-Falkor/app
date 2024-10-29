import { invoke } from "@/lib";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAppStartup = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    window.ipcRenderer.on("app:deep-link", async (_event, url: string) => {
      // Extract everything after 'falkor://'
      const deepLinkContent = url?.split("falkor://")?.[1];

      const command = deepLinkContent?.split("/")?.[0];
      const args = deepLinkContent?.split("/")?.slice(1);

      if (!command) return;
      if (command === "install-plugin" && args.length) {
        const url = args.join("/");

        if (!url.includes("setup.json")) return;

        const installed = await invoke<
          { message: string; success: boolean },
          string
        >("plugins:install", url);
        if (!installed?.success) {
          toast.error(installed?.message ?? null);
          return;
        }

        toast.success(installed?.message ?? null);
      }

      setHasLoaded(true);
    });

    return () => {
      window.ipcRenderer.removeAllListeners("app:deep-link");
    };
  }, []);

  return {
    hasLoaded,
  };
};
