import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFetchError } from "@/components/error-state/data-fetch-error";

export default function ScenarioModelMetrics({ result }: { result: RunPipelineReturn }) {
  const {
    data: allScenariosCount,
    isLoading: isLoadingScenarios,
    isError: isErrorScenarios,
  } = useQuery({
    ...queryKeys.scenarios.count(),
  });
  const {
    data: allModelsCount,
    isLoading: isLoadingModels,
    isError: isErrorModels,
  } = useQuery({
    ...queryKeys.models.count(),
  });

  const isLoadingState = result.isLoading || isLoadingScenarios || isLoadingModels;
  const isErrorState = result.isError || isErrorScenarios || isErrorModels;

  const modelsCount = new Set(result.runs.map((run) => run.modelName));
  const scenarioCount = new Set(result.runs.map((run) => run.scenarioName));

  if (isLoadingState) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Scenario metrics
        </p>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-full overflow-hidden rounded-md" />
          <Skeleton className="h-6 w-3/4 overflow-hidden rounded-md" />
        </div>
      </div>
    );
  }

  if (isErrorState) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="mb-1.5 border-b pb-1.5 text-base font-bold text-stone-800">
          Scenario metrics
        </p>
        <div className="flex flex-col gap-3">
          <DataFetchError />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1.5 border-b pb-1.5 text-base leading-6 font-bold text-stone-800">
        Current Scenario Set
      </p>
      <ul className="ml-5 list-outside list-disc space-y-2">
        <li className="text-foreground text-sm leading-5">
          <p>
            <strong>{scenarioCount.size}</strong> out of <strong>{allScenariosCount}</strong>{" "}
            available scenarios
          </p>
        </li>
        <li className="text-foreground text-sm leading-5">
          <p>
            <strong>{modelsCount.size}</strong> out of <strong>{allModelsCount}</strong> available
            models
          </p>
        </li>
      </ul>
    </div>
  );
}
