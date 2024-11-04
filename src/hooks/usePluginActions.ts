import { invoke } from "@/lib";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UsePlugins from "./usePlugins";

export const usePluginActions = (pluginId: string) => {
  const queryClient = useQueryClient();
  const { removeNeedsUpdate } = UsePlugins();

  const reloadQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["sources"],
      exact: false,
    });

    await queryClient.invalidateQueries({
      queryKey: ["plugins"],
    });
  };

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

  const updatePlugin = async () => {
    const updated = await invoke("plugins:update-plugin", pluginId);

    if (!updated) {
      toast.error("Failed to update plugin");
      return;
    }

    toast.success("Plugin updated successfully!");
    removeNeedsUpdate(pluginId);
    await reloadQueries();

    return updated;
  };

  return {
    disablePlugin,
    enablePlugin,
    uninstallPlugin,
    updatePlugin,
  };
};
