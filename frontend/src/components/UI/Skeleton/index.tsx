/**
 * Skeleton loading placeholders used across the ERP.
 * Pure presentational components (no hooks) so they work in both
 * Server Components (e.g. app/loading.tsx) and Client Components.
 */

interface SkeletonProps {
  className?: string;
}

/** Single shimmering block. Size it with Tailwind classes (h-*, w-*). */
export function Skeleton({ className = "" }: SkeletonProps) {
  return <div aria-hidden="true" className={`skeleton rounded-md ${className}`} />;
}

const cardClass = "rounded-xl border border-dark-tertiary bg-dark-secondary";

/** Page title, breadcrumb and primary action. */
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-3.5 w-80 max-w-full" />
      </div>
      <Skeleton className="h-10 w-36 rounded-lg" />
    </div>
  );
}

/** Row of KPI / stat cards. */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${cardClass} flex items-center gap-4 p-4`}>
          <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Search box + filter buttons above a table. */
export function ToolbarSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Skeleton className="h-10 w-72 max-w-full rounded-lg" />
      <Skeleton className="h-10 w-28 rounded-lg" />
      <Skeleton className="h-10 w-28 rounded-lg" />
      <Skeleton className="ml-auto h-10 w-24 rounded-lg" />
    </div>
  );
}

/** Data table with header row, body rows and pagination. */
export function TableSkeleton({
  rows = 8,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className={`${cardClass} overflow-hidden`}>
      <div className="flex gap-4 border-b border-dark-tertiary bg-dark-tertiary/30 px-4 py-3">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-3.5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 border-b border-dark-tertiary/60 px-4 py-3.5 last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-4 flex-1 ${c === 0 ? "max-w-[90px]" : ""}`}
            />
          ))}
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-dark-tertiary px-4 py-3">
        <Skeleton className="h-3.5 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

/** Generic form: label + input pairs in two columns. */
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className={`${cardClass} space-y-5 p-6`}>
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Full-page skeleton shown while a page loads:
 * header, stat cards, toolbar and table.
 */
export function PageSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading page"
      className="w-full space-y-6"
    >
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <ToolbarSkeleton />
      <TableSkeleton />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Record / detail screen: header plus two form-like cards. */
export function DetailPageSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading page" className="w-full space-y-6">
      <PageHeaderSkeleton />
      <FormSkeleton fields={6} />
      <FormSkeleton fields={4} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Dashboard: header, KPI cards and two chart panels. */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading page" className="w-full space-y-6">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={4} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
      <TableSkeleton rows={4} cols={5} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
export default PageSkeleton;
