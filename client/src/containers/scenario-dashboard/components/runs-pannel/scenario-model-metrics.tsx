import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";

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

  const modelsCount = new Set(result.runs.map((run) => run.model.name));
  const scenarioCount = new Set(result.runs.map((run) => run.scenario.name));

  const scenariosRatio = `${scenarioCount.size}/${allScenariosCount}`;
  const modelsRatio = `${modelsCount.size}/${allModelsCount}`;

  return (
    <div className="mb-6">
      <p className="mb-4 border-b pb-1.5 text-base leading-6 font-bold text-stone-800">
        Scenario metrics
      </p>
      <ul className="ml-5 list-outside list-disc space-y-2">
        <li className="text-foreground text-sm leading-5">
          Scenarios: {isLoadingState || isErrorState ? "Loading scenarios..." : scenariosRatio}
        </li>
        <li className="text-foreground text-sm leading-5">
          Models: {isLoadingState || isErrorState ? "Loading models..." : modelsRatio}
        </li>
      </ul>
    </div>
  );
}
