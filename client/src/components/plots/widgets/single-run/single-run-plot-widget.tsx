"use client";

import { PlotWidgetHeader } from "@/components/plots/components/plot-widget-header";
import { SingleScenarioPlotConfig } from "@/lib/config/tabs/variables-config";
import useSyncRunsPipeline from "@/hooks/runs/pipeline/use-sync-runs-pipeline";
import PlotLegend from "@/components/plots/components/plot-legend";
import { StackedAreaPlot } from "@/components/plots/plot-variations";
import { usePlotDownload } from "@/hooks/plots/download/use-plot-download";

interface Props {
  runId: number;
  plotConfig: SingleScenarioPlotConfig;
}

export function SingleRunPlotWidget({ runId, plotConfig }: Props) {
  const data = useSyncRunsPipeline({
    variablesNames: plotConfig.variables as string[],
    runId,
  });

  const { chartRef, legendRef, handleDownload } = usePlotDownload({
    runs: data.runs,
    title: plotConfig.title || "plot",
    imageOptions: {
      padding: { all: 30 },
      includeInFilename: true,
    },
  });

  return (
    <div className="flex w-full flex-col justify-between rounded-md bg-white p-4 select-none">
      <PlotWidgetHeader title={plotConfig.title} onDownload={handleDownload} />
      <div ref={legendRef}>
        {data.runs[0] && <PlotLegend runs={data.runs} plotConfig={plotConfig} />}
      </div>
      <div ref={chartRef}>
        <StackedAreaPlot data={data} variablesMap={plotConfig.variablesMap} />
      </div>
    </div>
  );
}
