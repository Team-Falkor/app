import { ExternalAccountType } from "@/@types/accounts";
import RealDebridClient from "@/lib/api/realdebrid";
import { create } from "zustand";

interface AccountsState {
  realDebrid: RealDebridClient | null;
  setRealDebrid: (access_token: string) => void;
  clearService: (type: ExternalAccountType) => void; // Optional: Adds ability to clear the client if needed
}

export const useAccountServices = create<AccountsState>((set) => ({
  realDebrid: null,
  accounts: [],

  setRealDebrid: (access_token: string) => {
    set((state) => {
      // Check if an instance already exists to avoid duplicate instantiation
      if (state.realDebrid) {
        console.warn("RealDebridClient is already set.");
        return state;
      }

      try {
        const client = RealDebridClient.getInstance(access_token);
        return { realDebrid: client };
      } catch (error) {
        console.error("Failed to set RealDebridClient instance:", error);
        return { realDebrid: null };
      }
    });
  },

  clearService: (type) => {
    switch (type) {
      case "real-debrid":
        set(() => ({ realDebrid: null }));
        break;
      default:
        console.warn(`No service found for type ${type}`);
    }
  },
}));
