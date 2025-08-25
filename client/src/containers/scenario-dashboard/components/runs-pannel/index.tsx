"use client";

import ScenarioModelMetrics from "@/containers/scenario-dashboard/components/runs-pannel/scenario-model-metrics";
import AdditionalInformation from "@/containers/scenario-dashboard/components/runs-pannel/additional-information";
import ScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import NavigateToCompareScenarios from "@/containers/scenario-dashboard/components/comparison/navigate-to-compare-scenarios";
import useBatchFilterRuns from "@/hooks/runs/pipeline/use-batch-filter-runs";

export default function RunsPanel({ variables }: { variables: readonly VARIABLE_TYPE[] }) {
  const result = useBatchFilterRuns({ variables });

  return (
    <div className="mx-auto flex w-120 flex-col gap-6">
      <NavigateToCompareScenarios />
      <ScenarioModelMetrics result={result} />
      <ScenarioFlags result={result} />
      <AdditionalInformation result={result} />
    </div>
  );
}
