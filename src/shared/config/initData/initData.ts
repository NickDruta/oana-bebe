import { PaginationRecord } from "../types/types";

export const initPaginationData: PaginationRecord = {
  pageNumber: 0,
  pageSize: 6,
  totalElements: 0,
  totalPages: 0,
};

export const singleSizePaginationData: PaginationRecord = {
  pageNumber: 1,
  pageSize: 1,
  totalElements: 0,
  totalPages: 0,
};
