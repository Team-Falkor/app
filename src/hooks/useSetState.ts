import { useState, useCallback } from "react";

export const useSetState = <T>(initialState: T[] = []) => {
  const [set, updateSet] = useState<Set<T>>(new Set(initialState));

  const add = useCallback((value: T) => {
    updateSet((prevSet) => new Set(prevSet).add(value));
  }, []);

  const remove = useCallback((value: T) => {
    updateSet((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  }, []);

  const clear = useCallback(() => updateSet(new Set()), []);

  const has = useCallback((value: T) => set.has(value), [set]);

  return { set, add, remove, clear, has };
};
