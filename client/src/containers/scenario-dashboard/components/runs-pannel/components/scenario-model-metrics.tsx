import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScenarioModelMetrics({ result }: { result: RunPipelineReturn }) {
  const {
    data,
    isLoading: isLoadingModels,
    isError: isErrorModels,
  } = useQuery({
    ...queryKeys.runs.list({}),
  });

  const isLoadingState = result.isLoading || isLoadingModels;
  const isErrorState = result.isError || isErrorModels;

  if (isLoadingState) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Loading Scenarios
        </p>
        <div className="flex w-full flex-col gap-3">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>
      </div>
    );
  }

  if (isErrorState || !data) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Error loading Scenarios
        </p>
      </div>
    );
  }

  const totalRuns = data.length;
  const currentRuns = new Set(result.runs.map((run) => run.runId)).size;

  return (
    <div className="mb-1.5 border-b pb-1.5 text-base leading-6 text-stone-800">
      {totalRuns == currentRuns ? (
        <p>
          Currently showing all <strong>{currentRuns}</strong> available scenarios
        </p>
      ) : (
        <p>
          Currently selected <strong>{currentRuns}</strong> out of <strong>{totalRuns}</strong>{" "}
          available scenarios
        </p>
      )}
    </div>
  );
}
