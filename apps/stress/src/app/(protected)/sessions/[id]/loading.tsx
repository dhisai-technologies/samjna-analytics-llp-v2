import { DataPageSkeleton } from "@ui/components/registry/data-skeleton";

export default function Loading() {
  return <DataPageSkeleton variant="rotatingLines" className="h-[calc(100vh-theme(spacing.14))] w-screen" />;
}
