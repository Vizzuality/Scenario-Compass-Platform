"use client";

import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/variable-plot-widget-header";
import PlotContent from "@/containers/scenario-dashboard/components/plot-widget/plot-widget-content";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import { useSingleRunPipeline } from "@/hooks/runs/pipeline/use-single-run-pipeline";
import { PLOT_TYPE_OPTIONS } from "@/containers/scenario-dashboard/components/plot-widget/chart-type-toggle";

interface Props {
  variable: VARIABLE_TYPE;
  runId: number;
}

export function SingleRunPlotWidget({ variable, runId }: Props) {
  const data = useSingleRunPipeline({ runId: runId, variable });

  return (
    <div className="w-full rounded-md bg-white p-4 select-none">
      <VariablePlotWidgetHeader variable={variable} chartType={PLOT_TYPE_OPTIONS.SINGLE_LINE} />
      <PlotContent chartType={PLOT_TYPE_OPTIONS.SINGLE_LINE} data={data} />
    </div>
  );
}
