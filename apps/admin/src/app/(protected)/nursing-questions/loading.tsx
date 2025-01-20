import {
  DataCardsSkeleton,
  DataHeaderSkeleton,
  DataPageSkeleton,
  DataToolbarSkeleton,
} from "@ui/components/registry/data-skeleton";

export default function Loading() {
  return (
    <DataPageSkeleton>
      <DataHeaderSkeleton variant="secondary" />
      <div className="p-3 lg:p-6 grid gap-3">
        <DataToolbarSkeleton leftCount={1} rightCount={1} />
        <DataCardsSkeleton count={5} skeletonClassName="h-24" />
      </div>
    </DataPageSkeleton>
  );
}
