import { useCallback, useState } from "react";

export interface FilterConfig {
  [key: string]: string | number | undefined;
}

export function useFilters<T extends FilterConfig>(
  initialFilters: T = {} as T,
) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = useCallback(
    (key: keyof T, value: string | number | undefined) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const setFilters_ = useCallback((newFilters: Partial<T>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== "",
  );

  return {
    filters,
    updateFilter,
    setFilters: setFilters_,
    clearFilters,
    hasFilters,
  };
}
