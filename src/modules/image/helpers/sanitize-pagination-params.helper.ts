// Define pagination constants
export const DEFAULT_PAGE_NUMBER = 1;
export const MIN_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 100;

function sanitizePaginationParams(pageNumber = DEFAULT_PAGE_NUMBER, pageSize = DEFAULT_PAGE_SIZE) {
  // Normalize page number: ensure it's a number, floored, and not less than minimum
  const sanitizedPageNumber = Number.isFinite(pageNumber)
    ? Math.max(MIN_PAGE_NUMBER, Math.floor(pageNumber))
    : DEFAULT_PAGE_NUMBER;

  // Normalize page size: ensure it's a number, floored, and within allowed range
  const sanitizedPageSize = Number.isFinite(pageSize)
    ? Math.max(MIN_PAGE_SIZE, Math.min(MAX_PAGE_SIZE, Math.floor(pageSize)))
    : DEFAULT_PAGE_SIZE;

  return {
    pageNumber: sanitizedPageNumber,
    pageSize: sanitizedPageSize,
  };
}
