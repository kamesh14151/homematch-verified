import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="h-64 w-full rounded-none" />

      {/* Content Skeleton */}
      <CardContent className="p-6 flex-1 flex flex-col gap-4">
        {/* Title and Badge */}
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Info Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Features Row */}
        <div className="flex gap-4 border-t border-b py-4 mt-auto">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>

      {/* Footer Skeleton */}
      <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-10 w-28 rounded-md" />
      </CardFooter>
    </Card>
  );
}
