import { ExternalAccount, ExternalTokenUpdateInput } from "@/@types/accounts";
import { invoke } from "@/lib";
import { getRealDebridAuthInstance } from "@/lib/api/realdebrid/auth";
import { useAccountServices } from "@/stores/account-services";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useAppStartup = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { setRealDebrid, realDebrid } = useAccountServices();

  const { data, isPending, error, isError } = useQuery({
    queryKey: ["accounts", "all"],
    queryFn: async () => {
      if (realDebrid) return [];
      const data = invoke<Array<ExternalAccount>, string | undefined>(
        "external-accounts:get-all"
      );

      return data;
    },
  });

  const setRD = useCallback(async () => {
    if (!data) return;
    if (realDebrid) return;

    const rd = data.find((account) => account.type === "real-debrid");
    if (!rd || !rd.access_token) return;

    // Convert `expires_in` from seconds to milliseconds
    const expiresInMs = rd.expires_in / 1000 - 1000;

    if (Date.now() + expiresInMs < Date.now()) {
      console.log("Access token expired, refreshing...");

      const auth = getRealDebridAuthInstance();

      auth.accessToken = rd.access_token;
      auth.refreshToken = rd.refresh_token;
      auth.clientId = rd.client_id!;
      auth.clientSecret = rd.client_secret!;

      const { access_token, refresh_token, expires_in } =
        await auth.refreshAccessToken();

      if (!access_token || !refresh_token || !expires_in) return;

      const input: ExternalTokenUpdateInput = {
        access_token: access_token!,
        refresh_token: refresh_token!,
        expires_in: new Date(Date.now() + expires_in * 1000), // Convert seconds to milliseconds here
      };

      await invoke<boolean>(
        "external-accounts:update",
        rd.email,
        input,
        rd.type
      );

      rd.access_token = access_token!;
      rd.refresh_token = refresh_token!;
      rd.expires_in = expires_in! * 1000; // Update `expires_in` to milliseconds
      setRealDebrid(rd.access_token);

      console.log("Access token refreshed successfully");

      return;
    }

    console.log("Found RealDebrid account:");
    setRealDebrid(rd.access_token);
  }, [data, realDebrid, setRealDebrid]);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (isError) {
      console.error("Error fetching accounts:", error);
      return;
    }

    if (!data) {
      console.error("No accounts found");
      return;
    }

    setRD();
  }, [data, isPending, isError, setRD, error]);

  useEffect(() => {
    window.ipcRenderer.on("app:deep-link", async (_event, url: string) => {
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
