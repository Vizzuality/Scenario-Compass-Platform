"use client";

import ScenarioModelMetrics from "@/containers/scenario-dashboard-container/components/runs-pannel/components/scenario-model-metrics";
import AdditionalInformation from "@/containers/scenario-dashboard-container/components/runs-pannel/components/additional-information";
import MultiRunScenarioFlags from "@/containers/scenario-dashboard-container/components/runs-pannel/scenario-flags/multi-run-scenario-flags-uncontrolled";
import NavigateToCompareScenarios from "@/containers/scenario-dashboard-container/components/comparison/navigate-to-compare-scenarios";
import useShowReasonsForConcern from "@/hooks/nuqs/tabs/use-show-reasons-for-concer";
import useGetVariablesForTab from "@/hooks/nuqs/tabs/use-get-variables-for-tab";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/data-pipeline/use-combine-runs-for-variables-pipeline";

interface Props {
  prefix?: string;
}

export default function RunsPanel({ prefix }: Props) {
  const { variables } = useGetVariablesForTab({ prefix });
  const result = useCombineRunsForVariablesPipeline({ variablesNames: variables, prefix });
  const showMetric = useShowReasonsForConcern({});

  return (
    <div className="mx-auto flex w-120 flex-col gap-6">
      <NavigateToCompareScenarios />
      {showMetric && (
        <>
          <ScenarioModelMetrics result={result} />
          <MultiRunScenarioFlags result={result} initialOpen={true} />
          <AdditionalInformation result={result} />
        </>
      )}
    </div>
  );
}

export function RunsPanelSkeleton() {
  return (
    <div className="mt-8 w-120 animate-pulse space-y-6">
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
      <div className="h-10 w-full rounded-[4px] bg-stone-200" />
    </div>
  );
}
