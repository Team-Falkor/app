import { ProtonDBSummary } from "@/@types";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";

export const useProtonDb = (appId: string) => {
  const getProtonDb = async () => {
    const response = await fetch(
      `https://www.protondb.com/api/v1/reports/summaries/${appId}.json`
    );
    const data: ProtonDBSummary = await response.json();

    return data;
  };

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["protonDb", appId],
    queryFn: getProtonDb,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!appId,
  });

  return {
    data,
    isPending,
    error,
    refetch,
  };
};
