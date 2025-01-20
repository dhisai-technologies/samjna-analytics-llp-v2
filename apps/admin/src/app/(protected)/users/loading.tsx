import { DataHeaderSkeleton, DataPageSkeleton, DataTableSkeleton } from "@ui/components/registry/data-skeleton";

export default function Loading() {
  return (
    <DataPageSkeleton>
      <DataHeaderSkeleton variant="secondary" />
      <div className="p-3 lg:p-6 grid gap-3">
        <DataTableSkeleton columnCount={5} searchableColumnCount={1} filterableColumnCount={2} />
      </div>
    </DataPageSkeleton>
  );
}
