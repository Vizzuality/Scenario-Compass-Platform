import { Skeleton } from "@/components/ui/skeleton";
import { DataFetchError } from "@/components/error-state/data-fetch-error";

export function ScenarioFlagsLoadingState() {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
        Reasons for Concern
      </p>
      <div className="flex w-full flex-col gap-3">
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-3/4 rounded-md" />
      </div>
    </div>
  );
}

export function ScenarioFlagsErrorState() {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
        Reasons for Concern
      </p>
      <div className="flex flex-col gap-3">
        <DataFetchError />
      </div>
    </div>
  );
}
