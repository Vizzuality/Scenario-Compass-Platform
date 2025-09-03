"use client";

import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/components/variable-plot-widget-header";
import PlotContentWrapper from "@/containers/scenario-dashboard/components/plot-widget/components/plot-content-wrapper";
import { PLOT_TYPE_OPTIONS } from "@/containers/scenario-dashboard/components/plot-widget/components/chart-type-toggle";
import { SingleScenarioPlotConfig } from "@/lib/config/tabs/variables-config";
import useSyncRunsPipeline from "@/hooks/runs/pipeline/use-sync-runs-pipeline";
import PlotLegend from "@/containers/scenario-dashboard/components/plot-widget/components/plot-legend";

interface Props {
  runId: number;
  plotConfig: SingleScenarioPlotConfig;
}

export function SingleRunPlotWidget({ runId, plotConfig }: Props) {
  const data = useSyncRunsPipeline({
    variablesNames: plotConfig.variables as string[],
    runId,
  });

  return (
    <div className="flex w-full flex-col justify-between rounded-md bg-white p-4 select-none">
      <div>
        <VariablePlotWidgetHeader
          title={plotConfig.title}
          chartType={PLOT_TYPE_OPTIONS.SINGLE_LINE}
        />
        {data.runs[0] && <PlotLegend run={data.runs[0]} plotConfig={plotConfig} />}
      </div>
      <PlotContentWrapper chartType={PLOT_TYPE_OPTIONS.STACKED_AREA} data={data} />
    </div>
  );
}
