import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page title skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Six stat card skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity card skeleton */}
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </CardContent>
      </Card>
    </div>
  );
}
