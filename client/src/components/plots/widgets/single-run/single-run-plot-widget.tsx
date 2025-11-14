"use client";

import { PlotWidgetHeader } from "@/components/plots/components/plot-widget-header";
import { SingleScenarioPlotConfig } from "@/lib/config/tabs/variables-config";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/data-pipeline/use-combine-runs-for-variables-pipeline";
import PlotLegend from "@/components/plots/components/plot-legend";
import { StackedAreaPlot } from "@/components/plots/plot-variations";
import { useDownloadPlotAssets } from "@/hooks/plots/download/use-download-plot-assets";

interface Props {
  plotConfig: SingleScenarioPlotConfig;
}

export function SingleRunPlotWidget({ plotConfig }: Props) {
  const data = useCombineRunsForVariablesPipeline({
    variablesNames: plotConfig.variables as string[],
  });

  const { chartRef, legendRef, handleDownload } = useDownloadPlotAssets({
    runs: data.runs,
    title: plotConfig.title.replaceAll("|", " - ") || "plot",
    imageOptions: {
      padding: { all: 30 },
      includeInFilename: true,
    },
  });

  return (
    <div className="flex w-full flex-col justify-between rounded-md bg-white p-4 select-none">
      <PlotWidgetHeader title={plotConfig.title} onDownload={handleDownload} />
      <div ref={legendRef}>
        {data.runs[0] && <PlotLegend runs={data.runs} variablesMap={plotConfig.variablesMap} />}
      </div>
      <div ref={chartRef}>
        <StackedAreaPlot data={data} variablesMap={plotConfig.variablesMap} />
      </div>
    </div>
  );
}
