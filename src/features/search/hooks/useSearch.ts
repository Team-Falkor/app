import { igdb } from "@/lib";
import { IGDBReturnDataType } from "@/lib/api/igdb/types";
import { useCallback, useEffect, useRef, useState } from "react";

// Define the type for the hook's return value
interface UseSearchResult {
  results: IGDBReturnDataType[];
  loading: boolean;
  error: string | null;
}

// Create the custom hook
function useSearch(query: string, limit?: number): UseSearchResult {
  const [results, setResults] = useState<IGDBReturnDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce delay
  const debounceDelay = 300; // Adjust as needed
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery) {
        setResults([]);
        return;
      }

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        setLoading(true);
        setError(null);

        try {
          const searchResults = await igdb.search(searchQuery, limit);
          setResults(searchResults);
        } catch (err) {
          setError("Failed to fetch search results.");
        } finally {
          setLoading(false);
        }
      }, debounceDelay);
    },
    [limit]
  );

  useEffect(() => {
    debouncedSearch(query);

    // Cleanup function to cancel the debounce on unmount or query change
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, debouncedSearch]);

  return { results, loading, error };
}

export default useSearch;
