import { ProtonDBSummary } from "@/@types";
import { useQuery } from "@tanstack/react-query";

export const useProtonDb = (appId: string) => {
  const getProtonDb = async () => {
    const response = await window.ipcRenderer.invoke(
      "request",
      `https://www.protondb.com/api/v1/reports/summaries/${appId}.json`
    );
    return response as ProtonDBSummary;
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
