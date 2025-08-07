import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import ScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags";
import { VariablePlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget";
import useBatchFilterRuns from "@/hooks/runs/pipeline/use-batch-filter-runs";
import { FilterArrayItem } from "@/containers/scenario-dashboard/comparison/main-plot-section";
import { RIGHT_COMPARISON_TAG } from "@/containers/scenario-dashboard/comparison/constants";

interface Props {
  variables: readonly VARIABLE_TYPE[];
  filters: FilterArrayItem[];
  onDelete?: (name: string) => void;
}

const prefix = RIGHT_COMPARISON_TAG;

export default function RightPanel({ variables, filters, onDelete }: Props) {
  const result = useBatchFilterRuns({ variables, prefix });

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

      <div className="pt-6 pl-6">
        <ScenarioFlags result={result} prefix={prefix} />
      </div>

      <div className="flex h-fit w-full flex-col gap-4 pt-6 pl-6">
        {variables.map((variable, index) => {
          return (
            <VariablePlotWidget
              key={index}
              variable={variable}
              prefix={prefix}
              initialChartType="line"
            />
          );
        })}
      </div>
    </div>
  );
}
