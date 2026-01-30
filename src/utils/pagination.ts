/**
 * Pagination Utilities
 *
 * Helpers for handling pagination with Zoom API.
 * Zoom uses page_size, page_number, and next_page_token for pagination.
 */

import type { PaginatedResponse, PaginationParams } from '../types/entities.js';

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  page_size: 30,
  maxPageSize: 300,
} as const;

/**
 * Normalize pagination parameters
 */
export function normalizePaginationParams(
  params?: PaginationParams,
  maxPageSize = PAGINATION_DEFAULTS.maxPageSize
): Required<Pick<PaginationParams, 'page_size'>> & Omit<PaginationParams, 'page_size'> {
  return {
    page_size: Math.min(params?.page_size || PAGINATION_DEFAULTS.page_size, maxPageSize),
    page_number: params?.page_number,
    next_page_token: params?.next_page_token,
  };
}

/**
 * Create an empty paginated response
 */
export function emptyPaginatedResponse<T>(): PaginatedResponse<T> {
  return {
    items: [],
    count: 0,
    hasMore: false,
  };
}

/**
 * Create a paginated response from an array
 */
export function createPaginatedResponse<T>(
  items: T[],
  options: {
    total?: number;
    total_records?: number;
    hasMore?: boolean;
    next_page_token?: string;
    page_count?: number;
    page_number?: number;
    page_size?: number;
  } = {}
): PaginatedResponse<T> {
  return {
    items,
    count: items.length,
    total: options.total || options.total_records,
    total_records: options.total_records,
    hasMore: options.hasMore ?? !!options.next_page_token,
    next_page_token: options.next_page_token,
    page_count: options.page_count,
    page_number: options.page_number,
    page_size: options.page_size,
  };
}

/**
 * Calculate if there are more items based on page-based pagination
 */
export function hasMoreItems(pageNumber: number, pageSize: number, total: number): boolean {
  return pageNumber * pageSize < total;
}

/**
 * Calculate next page number for page-based pagination
 */
export function getNextPageNumber(
  currentPage: number,
  pageSize: number,
  total: number
): number | undefined {
  const next = currentPage + 1;
  return next * pageSize < total ? next : undefined;
}
