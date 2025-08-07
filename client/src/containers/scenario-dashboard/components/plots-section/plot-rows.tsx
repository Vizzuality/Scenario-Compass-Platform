import { VariablePlotWidget } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget";
import { cn } from "@/lib/utils";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import useBatchFilterRuns from "@/hooks/runs/pipeline/use-batch-filter-runs";
import ScenarioFlags from "@/containers/scenario-dashboard/components/runs-pannel/scenario-flags";
import { ClimateFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/climate-filter";
import { EnergyFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/energy-filter";
import { LandFilterRow } from "@/containers/scenario-dashboard/components/meta-scenario-filters/land-filter";

interface PlotsSectionProps {
  variables: readonly VARIABLE_TYPE[];
  className?: string;
  prefix?: string;
}

export function PlotRows({ variables, className, prefix }: PlotsSectionProps) {
  const result = useBatchFilterRuns({ variables, prefix });

  return (
    <div>
      <div className="divide-y border-t border-b">
        <div className={cn(className, "flex items-center gap-2 py-4")}>
          <ClimateFilterRow prefix={prefix} />
        </div>
        <div className={cn(className, "flex items-center gap-2 py-4")}>
          <EnergyFilterRow prefix={prefix} />
        </div>
        <div className={cn(className, "flex items-center gap-2 py-4")}>
          <LandFilterRow prefix={prefix} />
        </div>
      </div>

      <div className={cn(className, "pt-6")}>
        <ScenarioFlags result={result} prefix={prefix} />
      </div>

      <div className={cn(className, "flex h-fit w-full flex-col gap-4 pt-6")}>
        <VariablePlotWidget variable={variables[0]} prefix={prefix} initialChartType="line" />
        <VariablePlotWidget variable={variables[1]} prefix={prefix} initialChartType="line" />
        <VariablePlotWidget variable={variables[2]} prefix={prefix} initialChartType="line" />
        <VariablePlotWidget variable={variables[3]} prefix={prefix} initialChartType="line" />
      </div>
    </div>
  );
}
