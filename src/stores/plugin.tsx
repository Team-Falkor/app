import { ItemDownload } from "@/@types";
import { create } from "zustand";

interface PluginStore {
  sources: ItemDownload[];
  isLoadingPlugins: boolean;
  appendSources: (newSources: ItemDownload[]) => void;
  resetSources: () => void;
  setLoadingState: (loading: boolean) => void;
}

const usePluginStore = create<PluginStore>((set) => ({
  sources: [],
  isLoadingPlugins: false,

  appendSources: (newSources) =>
    set((state) => {
      const updatedSources = [...state.sources];

      newSources.forEach((newSource) => {
        const existingSource = updatedSources.find(
          (source) => source.name === newSource.name
        );

        if (existingSource) {
          // Update existing source if necessary, otherwise skip
          existingSource.sources = newSource.sources;
        } else {
          // Append new source if it's not a duplicate
          updatedSources.push(newSource);
        }
      });

      return { sources: updatedSources };
    }),

  resetSources: () => set({ sources: [] }),

  setLoadingState: (loading) => set({ isLoadingPlugins: loading }),
}));

export default usePluginStore;
