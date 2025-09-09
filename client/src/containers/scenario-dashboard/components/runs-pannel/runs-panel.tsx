"use client";

import ScenarioModelMetrics from "@/containers/scenario-dashboard/components/runs-pannel/components/scenario-model-metrics";
import AdditionalInformation from "@/containers/scenario-dashboard/components/runs-pannel/components/additional-information";
import MultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags";
import NavigateToCompareScenarios from "@/containers/scenario-dashboard/components/comparison/navigate-to-compare-scenarios";
import useSyncVariables from "@/hooks/runs/pipeline/use-sync-variables";
import useShowReasonsForConcern from "@/hooks/nuqs/use-show-reasons-for-concer";

interface Props {
  prefix?: string;
}

export default function RunsPanel({ prefix }: Props) {
  const { result } = useSyncVariables({ prefix });
  const showMetric = useShowReasonsForConcern({});

  return (
    <div className="mx-auto flex w-120 flex-col gap-6">
      <NavigateToCompareScenarios />
      {showMetric && (
        <>
          <ScenarioModelMetrics result={result} />
          <MultiRunScenarioFlags result={result} />
          <AdditionalInformation result={result} />
        </>
      )}
    </div>
  );
}
