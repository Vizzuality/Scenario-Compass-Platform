import MultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags";
import { FilterArrayItem } from "@/containers/scenario-dashboard/comparison/scenario-comparison-plots-section";
import { RIGHT_COMPARISON_TAG } from "@/containers/scenario-dashboard/comparison/utils";
import { MultipleRunsPlotWidget } from "@/components/plots/widgets/multiple-runs/multiple-runs-plot-widget";
import { PLOT_TYPE_OPTIONS } from "@/components/plots/components/chart-type-toggle";
import useSyncVariables from "@/hooks/runs/pipeline/use-sync-variables";
import CustomTabPlotGrid from "@/containers/scenario-dashboard/components/plots-section/custom-tab-plot-grid";
import useShowReasonsForConcern from "@/hooks/nuqs/use-show-reasons-for-concer";

interface Props {
  filters: FilterArrayItem[];
  onDelete?: (name: string) => void;
}

const prefix = RIGHT_COMPARISON_TAG;

export default function RightPanel({ filters, onDelete }: Props) {
  const { result, selectedTab } = useSyncVariables({ prefix });
  const showMetric = useShowReasonsForConcern({ prefix });

  const handleOnDelete = (name: string) => {
    onDelete?.(name);
  };

  return (
    <div>
      <div className="divide-y border-t border-b">
        {filters.map((filter, index) => {
          return (
            <div className="flex items-center gap-2 py-4 pl-6" key={index}>
              <filter.component
                prefix={prefix}
                {...(onDelete && { onDelete: () => handleOnDelete(filter.name) })}
              />
            </div>
          );
        })}
      </div>

      {showMetric && (
        <div className="pt-6 pl-4">
          <MultiRunScenarioFlags result={result} prefix={prefix} />
        </div>
      )}

      <div className="flex h-fit w-full flex-col gap-4 pt-6 pl-4">
        {!selectedTab.isCustom &&
          selectedTab.explorationPlotConfigArray.map((plotConfig) => {
            return (
              <MultipleRunsPlotWidget
                plotConfig={plotConfig}
                key={plotConfig.title}
                prefix={prefix}
                initialChartType={PLOT_TYPE_OPTIONS.MULTIPLE_LINE}
              />
            );
          })}
      </div>
      {selectedTab.isCustom && (
        <CustomTabPlotGrid
          prefix={prefix}
          className="flex h-fit w-full flex-col gap-4 pt-6 pl-4"
          initialChartType={PLOT_TYPE_OPTIONS.MULTIPLE_LINE}
        />
      )}
    </div>
  );
}
