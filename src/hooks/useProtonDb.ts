import { ProtonDBSummary } from "@/@types";
import { useQuery } from "@tanstack/react-query";

export const useProtonDb = (appId: string) => {
  const getProtonDb = async (): Promise<ProtonDBSummary | null> => {
    const response = await window.ipcRenderer.invoke(
      "request",
      `https://www.protondb.com/api/v1/reports/summaries/${appId}.json`
    );
    return response;
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
