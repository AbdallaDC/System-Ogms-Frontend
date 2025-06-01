// components/table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showActions?: boolean;
  showFilter?: boolean;
  showPagination?: boolean;
}

export function TableSkeleton({
  columns,
  rows = 5,
  showActions = true,
  showFilter = true,
  showPagination = true,
}: TableSkeletonProps) {
  return (
    <div className="rounded-lg border p-4 animate-pulse">
      {/* Filter and Action Bar */}
      <div className="flex items-center justify-between mb-4">
        {showFilter && <Skeleton className="h-10 w-64 rounded-md" />}
        <div className="flex space-x-2">
          {showActions && (
            <>
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </>
          )}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 border-b pb-4">
        <div className="col-span-1">
          <Skeleton className="h-4 w-4 mx-auto" />
        </div>
        {Array.from({ length: columns - (showActions ? 2 : 1) }).map((_, i) => (
          <div key={i} className="col-span-2">
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
        {showActions && (
          <div className="col-span-1">
            <Skeleton className="h-4 w-3/4 ml-auto" />
          </div>
        )}
      </div>

      {/* Table Rows */}
      <div className="space-y-4 mt-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 flex justify-center">
              <Skeleton className="h-4 w-4" />
            </div>

            {/* Data cells */}
            {Array.from({ length: columns - (showActions ? 2 : 1) }).map(
              (_, cellIndex) => (
                <div key={cellIndex} className="col-span-2">
                  <Skeleton className="h-4 w-full" />
                  {cellIndex === 0 && <Skeleton className="h-3 w-2/3 mt-2" />}
                </div>
              )
            )}

            {/* Action cell */}
            {showActions && (
              <div className="col-span-1 flex justify-end">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between mt-6">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      )}
    </div>
  );
}
