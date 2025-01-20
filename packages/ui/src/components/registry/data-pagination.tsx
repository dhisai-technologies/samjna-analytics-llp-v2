"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@ui/components/ui/pagination";
import { usePagination } from "@ui/hooks/use-pagination";

interface DataPaginationProps extends React.ComponentProps<typeof Pagination> {
  pageCount: number;
  defaultPerPage?: number;
}

export function DataPagination({ defaultPerPage, pageCount, ...props }: DataPaginationProps) {
  const { pagination, setPagination } = usePagination({ defaultPerPage });
  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={pagination.pageIndex === 0}
            onClick={() => {
              if (pagination.pageIndex === 0) {
                return;
              }
              setPagination(({ pageIndex, pageSize }) => ({
                pageIndex: pageIndex - 1,
                pageSize,
              }));
            }}
          />
        </PaginationItem>
        {pagination.pageIndex - 2 >= 0 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pagination.pageIndex - 1 >= 0 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => {
                setPagination(({ pageIndex, pageSize }) => ({
                  pageIndex: pageIndex - 1,
                  pageSize,
                }));
              }}
            >
              {pagination.pageIndex}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {pagination.pageIndex + 1}
          </PaginationLink>
        </PaginationItem>
        {pagination.pageIndex + 1 < pageCount && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => {
                setPagination(({ pageIndex, pageSize }) => ({
                  pageIndex: pageIndex + 1,
                  pageSize,
                }));
              }}
            >
              {pagination.pageIndex + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {pagination.pageIndex + 2 < pageCount && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={pagination.pageIndex === pageCount - 1}
            onClick={() => {
              if (pagination.pageIndex === pageCount - 1) {
                return;
              }
              setPagination(({ pageIndex, pageSize }) => ({
                pageIndex: pageIndex + 1,
                pageSize,
              }));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
