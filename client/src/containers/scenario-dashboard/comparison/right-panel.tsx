import MultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags";
import { COMPARISON_TAG } from "@/containers/scenario-dashboard/comparison/utils";
import useSyncVariables from "@/hooks/runs/pipeline/use-sync-variables";
import useShowReasonsForConcern from "@/hooks/nuqs/use-show-reasons-for-concer";
import { VerticalComparisonPlotGrid } from "@/containers/scenario-dashboard/comparison/vertical-comparison-plot-grid";

const prefix = COMPARISON_TAG;

export default function RightPanel() {
  const { result, selectedTab } = useSyncVariables({ prefix });
  const showMetric = useShowReasonsForConcern({ prefix });

  return (
    <div>
      {showMetric && (
        <div className="pt-6 pl-4">
          <MultiRunScenarioFlags result={result} prefix={prefix} />
        </div>
      )}
      <div className="flex h-fit w-full flex-col gap-4 pt-6 pl-4">
        <VerticalComparisonPlotGrid selectedTab={selectedTab} prefix={prefix} />
      </div>
    </div>
  );
}
