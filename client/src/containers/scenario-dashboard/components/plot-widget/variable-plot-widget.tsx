"use client";

import { useState } from "react";
import { ChartType } from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";
import { getPlotDimensions } from "@/components/plots/utils/chart";
import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget-header";
import { VariableSelect } from "@/containers/scenario-dashboard/components/plot-widget/variable-select";
import PlotContent from "@/containers/scenario-dashboard/components/plot-widget/plot-widget-content";
import { useNewFilterPointsPipeline } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";

interface Props {
  variable: VARIABLE_TYPE;
  prefix?: string;
  initialChartType?: ChartType;
}

export function VariablePlotWidget({ variable, prefix, initialChartType = "area" }: Props) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const { runs, isLoading, isError } = useNewFilterPointsPipeline({ variable, prefix });
  const dimensions = getPlotDimensions();

  return (
    <div className="w-full rounded-md bg-white p-4 select-none">
      <VariablePlotWidgetHeader variable={variable} chartType={chartType} onChange={setChartType} />
      <VariableSelect variable={variable} />
      <div
        className="relative w-full"
        style={{
          aspectRatio: dimensions.WIDTH / dimensions.HEIGHT,
        }}
      >
        <PlotContent
          chartType={chartType}
          runs={runs}
          isLoading={isLoading}
          isError={isError}
          prefix={prefix}
        />
      </div>
    </div>
  );
}
