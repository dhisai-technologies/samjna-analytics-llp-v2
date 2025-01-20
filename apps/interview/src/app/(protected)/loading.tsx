import { DataCardsSkeleton, DataPageSkeleton, DataToolbarSkeleton } from "@ui/components/registry/data-skeleton";
import { Separator } from "@ui/components/ui/separator";

export default function Loading() {
  return (
    <DataPageSkeleton>
      <main className="p-3 lg:p-6 grid gap-3">
        <div>
          <h1 className="text-xl font-semibold">Interviews</h1>
          <p className="text-muted-foreground text-sm">
            Oversee, organize, and analyze interview processes effectively.
          </p>
        </div>
        <Separator />
        <div className="grid gap-3">
          <DataToolbarSkeleton leftCount={2} rightCount={2} />
          <DataCardsSkeleton skeletonClassName="h-24" />
        </div>
      </main>
    </DataPageSkeleton>
  );
}
