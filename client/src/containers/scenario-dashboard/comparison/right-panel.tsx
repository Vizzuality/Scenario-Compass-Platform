import MultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags";
import { COMPARISON_TAG } from "@/containers/scenario-dashboard/comparison/utils";
import useShowReasonsForConcern from "@/hooks/nuqs/use-show-reasons-for-concer";
import { VerticalComparisonPlotGrid } from "@/containers/scenario-dashboard/comparison/vertical-comparison-plot-grid";
import useGetVariablesForTab from "@/hooks/runs/pipeline/use-get-variables-for-tab";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/pipeline/use-combine-runs-for-variables-pipeline";

const prefix = COMPARISON_TAG;

export default function RightPanel() {
  const { selectedTab, variables } = useGetVariablesForTab({ prefix });
  const result = useCombineRunsForVariablesPipeline({ variablesNames: variables, prefix });
  const showMetric = useShowReasonsForConcern({ prefix });

  return (
    <div>
      {showMetric && (
        <div className="pt-6 pl-4">
          <MultiRunScenarioFlags result={result} prefix={prefix} initialOpen={false} />
        </div>
      )}
      <div className="flex h-fit w-full flex-col gap-4 pt-6 pl-4">
        <VerticalComparisonPlotGrid selectedTab={selectedTab} prefix={prefix} />
      </div>
    </div>
  );
}
