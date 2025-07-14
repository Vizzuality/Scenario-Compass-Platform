"use client";

import { useState } from "react";
import { ChartType } from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";
import { useFilterPointsPipeline } from "@/hooks/use-filter-points-pipeline";
import { getPlotDimensions } from "@/components/plots/utils/chart";
import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget-header";
import { VariableSelect } from "@/containers/scenario-dashboard/components/plot-widget/variable-select";
import PlotContent from "@/containers/scenario-dashboard/components/plot-widget/plot-widget-content";

interface Props {
  variable: string;
}

export function VariablePlotWidget({ variable }: Props) {
  const [chartType, setChartType] = useState<ChartType>("area");
  const { dataPoints, isLoading, isError } = useFilterPointsPipeline(variable);
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
          dataPoints={dataPoints || []}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
