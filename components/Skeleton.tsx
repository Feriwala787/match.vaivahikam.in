export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-light rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-surface rounded-xl p-6 border border-surface-light space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-1/4" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-1/2 mx-auto" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
