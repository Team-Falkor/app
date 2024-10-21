import { useCallback, useState } from "react";

// Hook for managing Map state
export const useMapState = <K, V>(initialState: [K, V][] = []) => {
  const [map, setMap] = useState<Map<K, V>>(new Map(initialState));

  const set = useCallback((key: K, value: V) => {
    setMap((prevMap) => new Map(prevMap).set(key, value));
  }, []);

  const get = useCallback((key: K) => map.get(key), [map]);

  const remove = useCallback((key: K) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const clear = useCallback(() => setMap(new Map()), []);

  return { map, set, get, remove, clear };
};
