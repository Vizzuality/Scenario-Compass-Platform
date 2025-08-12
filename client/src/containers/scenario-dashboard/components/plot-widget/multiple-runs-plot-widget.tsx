import { useEffect, useState } from "react";
import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget-header";
import { useRouter } from "next/navigation";
import {
  ChartType,
  PLOT_TYPE_OPTIONS,
} from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";
import {
  ExtendedRun,
  useMultipleRunsPipeline,
} from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { INTERNAL_PATHS } from "@/lib/paths";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import { VariableSelect } from "@/containers/scenario-dashboard/components/plot-widget/variable-select";
import PlotContent from "@/containers/scenario-dashboard/components/plot-widget/plot-widget-content";

interface Props {
  variable: VARIABLE_TYPE;
  prefix?: string;
  initialChartType?: ChartType;
}

export function MultipleRunsPlotWidget({ variable, prefix, initialChartType = "area" }: Props) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);

  useEffect(() => {
    setChartType(initialChartType);
  }, [initialChartType]);

  const data = useMultipleRunsPipeline({ variable, prefix });
  const router = useRouter();

  const handleRunClick = (run: ExtendedRun) => {
    router.push(`${INTERNAL_PATHS.SCENARIO_DASHBOARD}/${run.id}`);
  };

  const showChartTypeToggle = chartType !== PLOT_TYPE_OPTIONS.DOTS;

  return (
    <div className="w-full rounded-md bg-white p-4 select-none">
      <VariablePlotWidgetHeader
        variable={variable}
        chartType={chartType}
        onChange={showChartTypeToggle ? setChartType : undefined}
      />
      <VariableSelect variable={variable} />
      <PlotContent chartType={chartType} data={data} prefix={prefix} onRunClick={handleRunClick} />
    </div>
  );
}
