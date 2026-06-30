import { PAGINATION } from "@config/constants";
import { useCallback, useState } from "react";

interface UsePaginationOptions {
  defaultPage?: number;
  defaultLimit?: number;
}

export function usePagination(options?: UsePaginationOptions) {
  const [page, setPage] = useState(
    options?.defaultPage ?? PAGINATION.DEFAULT_PAGE,
  );
  const [limit, setLimit] = useState(
    options?.defaultLimit ?? PAGINATION.DEFAULT_LIMIT,
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setPage(PAGINATION.DEFAULT_PAGE); // Reset to page 1 when limit changes
    setLimit(newLimit);
  }, []);

  const reset = useCallback(() => {
    setPage(options?.defaultPage ?? PAGINATION.DEFAULT_PAGE);
    setLimit(options?.defaultLimit ?? PAGINATION.DEFAULT_LIMIT);
  }, [options]);

  return {
    page,
    limit,
    onPageChange: handlePageChange,
    onLimitChange: handleLimitChange,
    reset,
  };
}
