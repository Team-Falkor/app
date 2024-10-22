import { invoke } from "@/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const usePluginActions = (pluginId: string) => {
  const queryClient = useQueryClient();

  const reloadQueries = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["plugins"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["sources"],
    });
  }, [queryClient]);

  const disablePlugin = async () => {
    const disabled = await invoke("plugins:disable", pluginId);

    if (!disabled) return;

    await reloadQueries();

    return disabled;
  };

  const enablePlugin = async () => {
    const enabled = await invoke("plugins:enable", pluginId);

    if (!enabled) return;

    await reloadQueries();

    return enabled;
  };

  const uninstallPlugin = async () => {
    const uninstalled = await invoke("plugins:delete", pluginId);

    if (!uninstalled) return;

    await reloadQueries();

    return uninstalled;
  };

  return {
    disablePlugin,
    enablePlugin,
    uninstallPlugin,
  };
};
