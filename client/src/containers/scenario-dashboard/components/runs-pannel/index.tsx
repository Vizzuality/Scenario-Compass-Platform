"use client";

import ScenarioModelMetrics from "@/containers/scenario-dashboard/components/runs-pannel/scenario-model-metrics";
import AdditionalInformation from "@/containers/scenario-dashboard/components/runs-pannel/additional-information";
import MultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import NavigateToCompareScenarios from "@/containers/scenario-dashboard/components/comparison/navigate-to-compare-scenarios";
import useMultipleRunsBatchFilter from "@/hooks/runs/pipeline/use-multiple-runs-batch-filter";

export default function RunsPanel({ variables }: { variables: readonly VARIABLE_TYPE[] }) {
  const result = useMultipleRunsBatchFilter({ variables });

  return (
    <div className="mx-auto flex w-120 flex-col gap-6">
      <NavigateToCompareScenarios />
      <ScenarioModelMetrics result={result} />
      <MultiRunScenarioFlags result={result} />
      <AdditionalInformation result={result} />
    </div>
  );
}
