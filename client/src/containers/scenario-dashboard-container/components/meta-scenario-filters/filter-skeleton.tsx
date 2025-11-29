export function AdvancedFilterSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-6 w-36 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="relative">
        <div className="flex h-13 w-full items-center justify-between rounded-[4px] border border-stone-300 bg-transparent px-3">
          <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
