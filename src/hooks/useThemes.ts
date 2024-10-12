import { ThemeResponse } from "@/@types";
import { useThemesStore } from "@/stores/themes";
import { useCallback, useEffect } from "react";

export const useThemes = () => {
  const { activeTheme, setActiveTheme } = useThemesStore();

  const ipcInvoke = async <T>(channel: string, ...args: any[]): Promise<T> => {
    try {
      return await window.ipcRenderer.invoke(channel, ...args);
    } catch (error) {
      console.error(`Error invoking IPC channel ${channel}:`, error);
      throw error;
    }
  };

  const fetchInstalledThemes = useCallback(async (): Promise<string[]> => {
    return await ipcInvoke<string[]>("themes:list");
  }, []);

  const getTheme = useCallback(async (name: string): Promise<string> => {
    return await ipcInvoke<string>("themes:get", name);
  }, []);

  const installTheme = useCallback(
    async (url: string): Promise<ThemeResponse> => {
      return await ipcInvoke<ThemeResponse>("themes:install", url);
    },
    []
  );

  const deleteTheme = useCallback(
    async (name: string): Promise<ThemeResponse> => {
      return await ipcInvoke<ThemeResponse>("themes:delete", name);
    },
    []
  );

  const setTheme = useCallback(
    (name: string) => {
      setActiveTheme(name);
    },
    [setActiveTheme]
  );

  // Load theme from localStorage if available
  useEffect(() => {
    const localStorageActiveTheme = localStorage.getItem("activeTheme");

    if (!localStorageActiveTheme) return;

    getTheme(localStorageActiveTheme)
      .then((theme) => {
        if (!theme?.length) {
          localStorage.removeItem("activeTheme");
          return;
        }

        setTheme(localStorageActiveTheme);
      })
      .catch((error) => {
        console.error("Error getting theme:", error);
      });
  }, [getTheme, setTheme]);

  return {
    activeTheme,
    fetchInstalledThemes,
    getTheme,
    installTheme,
    deleteTheme,
    setTheme,
  };
};
