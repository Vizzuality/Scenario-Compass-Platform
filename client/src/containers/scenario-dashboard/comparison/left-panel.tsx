import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import MultiRunScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags/multi-run-scenario-flags";
import useMultipleRunsBatchFilter from "@/hooks/runs/pipeline/use-multiple-runs-batch-filter";
import { FilterArrayItem } from "@/containers/scenario-dashboard/comparison/main-plot-section";
import { LEFT_COMPARISON_TAG } from "@/containers/scenario-dashboard/comparison/utils";
import { MultipleRunsPlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/multiple-runs-plot-widget";
import { PLOT_TYPE_OPTIONS } from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";

interface Props {
  variables: readonly VARIABLE_TYPE[];
  filters: FilterArrayItem[];
}

const prefix = LEFT_COMPARISON_TAG;

export default function LeftPanel({ variables, filters }: Props) {
  const result = useMultipleRunsBatchFilter({ variables, prefix });

  return (
    <div className="border-r">
      <div className="divide-y border-t border-b">
        {filters.map((filter, index) => {
          return (
            <div className="flex items-center gap-2 py-4 pl-6" key={index}>
              <filter.component prefix={prefix} />
            </div>
          );
        })}
      </div>

      <div className="pt-6 pr-6">
        <MultiRunScenarioFlags result={result} prefix={prefix} />
      </div>

      <div className="flex h-fit w-full flex-col gap-4 pt-6 pr-6">
        {variables.map((variable, index) => {
          return (
            <MultipleRunsPlotWidget
              key={index}
              variable={variable}
              prefix={prefix}
              initialChartType={PLOT_TYPE_OPTIONS.MULTIPLE_LINE}
            />
          );
        })}
      </div>
    </div>
  );
}
