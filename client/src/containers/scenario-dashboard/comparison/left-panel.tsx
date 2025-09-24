import MultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags";
import useSyncVariables from "@/hooks/runs/pipeline/use-sync-variables";
import useShowReasonsForConcern from "@/hooks/nuqs/use-show-reasons-for-concer";
import { VerticalComparisonPlotGrid } from "@/containers/scenario-dashboard/comparison/vertical-comparison-plot-grid";

const prefix = "";

export default function LeftPanel() {
  const { result, selectedTab } = useSyncVariables({ prefix });
  const showMetric = useShowReasonsForConcern({ prefix });

  return (
    <div className="border-r">
      {showMetric && (
        <div className="pt-6 pr-4">
          <MultiRunScenarioFlags result={result} prefix={prefix} />
        </div>
      )}
      <div className="flex h-fit w-full flex-col gap-4 pt-6 pr-4">
        <VerticalComparisonPlotGrid selectedTab={selectedTab} prefix={prefix} />
      </div>
    </div>
  );
}
