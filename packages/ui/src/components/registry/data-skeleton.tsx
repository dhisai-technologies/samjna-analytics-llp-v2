import { Separator } from "@ui/components/ui/separator";
import { Skeleton } from "@ui/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/components/ui/table";
import { cn } from "@ui/utils";
import { Icons } from "../icons";
import { SidebarTrigger } from "../ui/sidebar";

interface DataPageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "rotatingLines" | "spinner";
}

function DataPageSkeleton({ variant = "default", className, children, ...props }: DataPageSkeletonProps) {
  switch (variant) {
    case "rotatingLines":
      return (
        <main className={cn("w-full h-full flex items-center justify-center", className)}>
          <Icons.rotatingLines />
        </main>
      );
    case "spinner":
      return (
        <main className={cn("w-full h-full flex items-center justify-center", className)}>
          <Icons.spinner />
        </main>
      );
    default:
      return (
        <main className={cn("w-full h-full", className)} {...props}>
          {children}
        </main>
      );
  }
}

interface DataHeaderSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "tertiary";
}

function DataHeaderSkeleton({ variant = "default", className, ...props }: DataHeaderSkeletonProps) {
  switch (variant) {
    case "secondary":
      return (
        <header className={cn("flex items-center justify-start w-full py-2 px-3 lg:px-6 h-12", className)} {...props}>
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Skeleton className="h-6 w-40 rounded-md" />
        </header>
      );
    case "tertiary":
      return (
        <header className={cn("flex items-center justify-start w-full py-2 px-3 lg:px-6 h-12", className)} {...props}>
          <Skeleton className="h-6 w-40 rounded-md" />
        </header>
      );
    default:
      return (
        <header className={cn("flex items-center justify-between w-full py-2 px-3 lg:px-6 h-12", className)} {...props}>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-[26px] w-[26px] rounded-full" />
        </header>
      );
  }
}

interface DataToolbarSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  leftCount?: number;
  rightCount?: number;
}

function DataToolbarSkeleton({ leftCount, rightCount, className, ...props }: DataToolbarSkeletonProps) {
  if (!leftCount && !rightCount) {
    return null;
  }
  return (
    <div className={cn("flex justify-between items-center", className)} {...props}>
      <div className="flex items-center justify-start space-x-2">
        {leftCount && leftCount > 0
          ? Array.from({
              length: leftCount,
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            }).map((_, i) => <Skeleton key={i} className="h-10 w-40" />)
          : null}
      </div>
      <div className="flex items-center justify-end space-x-2">
        {rightCount && rightCount > 0
          ? Array.from({
              length: rightCount,
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            }).map((_, i) => <Skeleton key={i} className="h-10 w-40" />)
          : null}
      </div>
    </div>
  );
}

interface DataCardsSkeletonProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "chat";
  count?: number;
  skeletonClassName?: string;
}

function DataCardsSkeleton({
  variant = "default",
  count = 5,
  skeletonClassName,
  className,
  ...props
}: DataCardsSkeletonProps) {
  switch (variant) {
    case "chat":
      return (
        <div className={cn("grid gap-3", className)} {...props}>
          {Array.from({
            length: count,
          }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className={cn("flex", index % 2 === 0 ? "justify-start" : "justify-end")}>
              <Skeleton className={cn("h-32 w-[60%] rounded-md", skeletonClassName)} />
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className={cn("grid gap-3", className)} {...props}>
          {Array.from({
            length: count,
          }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton key={index} className={cn("h-32", skeletonClassName)} />
          ))}
        </div>
      );
  }
}

interface DataTableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  columnCount: number;
  rowCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  showViewOptions?: boolean;
  showCreateButton?: boolean;
  cellWidths?: string[];
  withPagination?: boolean;
  shrinkZero?: boolean;
}

function DataTableSkeleton(props: DataTableSkeletonProps) {
  const {
    columnCount,
    rowCount = 5,
    searchableColumnCount = 0,
    filterableColumnCount = 0,
    showCreateButton = true,
    showViewOptions = true,
    cellWidths = ["auto"],
    withPagination = true,
    shrinkZero = false,
    className,
    ...skeletonProps
  } = props;

  return (
    <div className={cn("w-full space-y-2.5 overflow-auto", className)} {...skeletonProps}>
      <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumnCount > 0
            ? Array.from({
                length: searchableColumnCount,
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              }).map((_, i) => <Skeleton key={i} className="h-10 w-40 lg:w-60" />)
            : null}
          {filterableColumnCount > 0
            ? Array.from({
                length: filterableColumnCount,
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              }).map((_, i) => <Skeleton key={i} className="h-10 w-[4.5rem] border-dashed" />)
            : null}
        </div>
        <div className="flex items-center space-x-2">
          {showCreateButton ? <Skeleton className="h-10 w-40" /> : null}
          {showViewOptions ? <Skeleton className="hidden h-10 w-[4.5rem] lg:flex" /> : null}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : "auto",
                    }}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : "auto",
                    }}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? (
        <div className="flex w-full items-center justify-end gap-3 overflow-auto p-1 sm:gap-8">
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-[4.5rem]" />
            </div>
            <div className="flex items-center justify-center text-sm font-medium">
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="hidden size-7 lg:block" />
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
              <Skeleton className="hidden size-7 lg:block" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { DataPageSkeleton, DataHeaderSkeleton, DataToolbarSkeleton, DataCardsSkeleton, DataTableSkeleton };
