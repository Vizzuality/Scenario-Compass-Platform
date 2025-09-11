"use client";

import { PlotWidgetHeader } from "@/components/plots/components/plot-widget-header";
import { SingleScenarioPlotConfig } from "@/lib/config/tabs/variables-config";
import useSyncRunsPipeline from "@/hooks/runs/pipeline/use-sync-runs-pipeline";
import PlotLegend from "@/components/plots/components/plot-legend";
import { StackedAreaPlot } from "@/components/plots/plot-variations";

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
        <PlotWidgetHeader title={plotConfig.title} />
        {data.runs[0] && <PlotLegend run={data.runs[0]} plotConfig={plotConfig} />}
      </div>
      <StackedAreaPlot data={data} variablesMap={plotConfig.variablesMap} />
    </div>
  );
}
