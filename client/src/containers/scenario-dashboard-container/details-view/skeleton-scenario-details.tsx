import { Skeleton } from "@/components/ui/skeleton";

function SkeletonHeader() {
  return (
    <div className="container mx-auto mb-8">
      <Skeleton className="mb-6 h-8 w-64" />
      <div className="grid grid-cols-[1fr_1fr] items-end gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_1fr] items-end gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

function SkeletonPlotCard() {
  return (
    <div className="flex h-full min-h-[300px] flex-col rounded-md bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      <Skeleton className="mb-4 h-9 w-48 rounded-md" />
      <Skeleton className="min-h-0 flex-1 rounded" />
    </div>
  );
}

function SkeletonSidebar() {
  return (
    <div className="my-8 flex w-120 flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-md border p-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="flex flex-col gap-3 rounded-md border p-4">
        <Skeleton className="h-5 w-28" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border p-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function SkeletonBody() {
  return (
    <div className="bg-background w-full">
      <div className="container mx-auto flex gap-16">
        <div className="my-8 grid h-fit min-h-[600px] w-full grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonPlotCard key={i} />
          ))}
        </div>
        <SkeletonSidebar />
      </div>
    </div>
  );
}

export default function ScenarioDetailsSkeleton() {
  return (
    <div className="w-full bg-white">
      <div className="h-16 w-full border-b">
        <div className="container mx-auto flex h-full items-center">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <SkeletonHeader />
      <SkeletonBody />
    </div>
  );
}
