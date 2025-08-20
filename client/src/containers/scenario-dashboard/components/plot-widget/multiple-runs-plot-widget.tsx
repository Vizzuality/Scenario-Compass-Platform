"use client";

import { useState } from "react";
import { ChartType } from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";
import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget-header";
import { VariableSelect } from "@/containers/scenario-dashboard/components/plot-widget/variable-select";
import PlotContent from "@/containers/scenario-dashboard/components/plot-widget/plot-widget-content";
import {
  ExtendedRun,
  useNewFilterPointsPipeline,
} from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import { useRouter } from "next/navigation";
import { INTERNAL_PATHS } from "@/lib/paths";

interface Props {
  variable: VARIABLE_TYPE;
  prefix?: string;
  initialChartType?: ChartType;
}

export function MultipleRunsPlotWidget({ variable, prefix, initialChartType = "area" }: Props) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const data = useNewFilterPointsPipeline({ variable, prefix });
  const router = useRouter();

  const handleRunClick = (run: ExtendedRun) => {
    router.push(`${INTERNAL_PATHS.SCENARIO_DASHBOARD}/${run.id}`);
  };

  return (
    <div className="w-full rounded-md bg-white p-4 select-none">
      <VariablePlotWidgetHeader variable={variable} chartType={chartType} onChange={setChartType} />
      <VariableSelect variable={variable} />
      <PlotContent chartType={chartType} data={data} prefix={prefix} onRunClick={handleRunClick} />
    </div>
  );
}
