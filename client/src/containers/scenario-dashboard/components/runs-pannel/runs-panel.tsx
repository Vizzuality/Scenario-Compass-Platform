"use client";

import ScenarioModelMetrics from "@/containers/scenario-dashboard/components/runs-pannel/components/scenario-model-metrics";
import AdditionalInformation from "@/containers/scenario-dashboard/components/runs-pannel/components/additional-information";
import MultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags";
import NavigateToCompareScenarios from "@/containers/scenario-dashboard/components/comparison/navigate-to-compare-scenarios";
import useSyncVariables from "@/hooks/runs/pipeline/use-sync-variables";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import queryKeys from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

interface Props {
  prefix?: string;
}

const queryKey = queryKeys.variables.list();

export default function RunsPanel({ prefix }: Props) {
  const { result } = useSyncVariables({ prefix });
  const { selectedTab, getAllCustomVariables } = useTabAndVariablesParams();
  const { data: variableOptions } = useQuery({
    ...queryKey,
    enabled: selectedTab.isCustom,
  });
  const allVariables = variableOptions ? getAllCustomVariables(variableOptions) : [];
  const showMetric = selectedTab.isCustom ? allVariables.length > 0 : true;

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
