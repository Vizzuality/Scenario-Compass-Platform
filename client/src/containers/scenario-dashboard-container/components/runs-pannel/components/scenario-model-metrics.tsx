import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { RunPipelineReturn } from "@/types/data/run";
import { Skeleton } from "@/components/ui/skeleton";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { filterVisibleRuns } from "@/utils/plots/filtering-functions";

export default function ScenarioModelMetrics({ result }: { result: RunPipelineReturn }) {
  const {
    data,
    isLoading: isLoadingModels,
    isError: isErrorModels,
  } = useQuery({
    ...queryKeys.runs.list({}),
  });
  const { hiddenFlags, showVetting } = useScenarioFlagsSelection();
  const isLoadingState = result.isLoading || isLoadingModels;
  const isErrorState = result.isError || isErrorModels;

  if (isLoadingState) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 pb-1.5 text-base font-bold text-stone-800">Loading Scenarios</p>
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
        <p className="mb-1.5 pb-1.5 text-base font-bold text-stone-800">Error loading Scenarios</p>
      </div>
    );
  }

  const totalRuns = data.length;
  const currentRuns = new Set(result.runs.map((run) => run.runId));

  const visibleRuns = filterVisibleRuns(result.runs, hiddenFlags, showVetting);
  const uniqueRunsCount = [...new Set(visibleRuns.map((item) => item.runId))].length;
  return (
    <div className="mb-1.5 pb-1.5 text-base leading-6 text-stone-800">
      {totalRuns == visibleRuns.length ? (
        <p>
          Currently showing all <strong>{currentRuns}</strong> available scenarios
        </p>
      ) : (
        <p>
          Currently selected <strong>{uniqueRunsCount}</strong> out of {totalRuns} available
          scenarios
        </p>
      )}
    </div>
  );
}
