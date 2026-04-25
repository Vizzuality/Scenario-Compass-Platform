"use client";

import { useEffect, useState } from "react";
import { PlotWidgetHeader } from "@/components/plots/components/plot-widget-header";
import { SingleScenarioPlotConfig } from "@/lib/config/tabs/variables-config";
import useCombineRunsForVariablesPipeline from "@/hooks/runs/data-pipeline/use-combine-runs-for-variables-pipeline";
import PlotLegend from "@/components/plots/components/plot-legend";
import { StackedAreaPlot } from "@/components/plots/plot-variations";
import { useDownloadPlotAssets } from "@/hooks/plots/download/use-download-plot-assets";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { StackedBarPlot } from "@/components/plots/plot-variations/stacked-bar-plot";
import { WaterfallPlot } from "@/components/plots/plot-variations/waterfall";
import { ChartDialog } from "@/components/custom/chart-dialog";
import { ChartType, PLOT_TYPE_OPTIONS } from "@/components/plots/components/chart-type-toggle";

interface Props {
  plotConfig: SingleScenarioPlotConfig;
}

export function SingleRunPlotWidget({ plotConfig }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [singleYearChartType, setSingleYearChartType] = useState<ChartType>(
    PLOT_TYPE_OPTIONS.STACKED_BAR,
  );

  const { startYear, endYear } = useBaseUrlParams();
  const isSingleYear = parseInt(startYear!) === parseInt(endYear!);

  const data = useCombineRunsForVariablesPipeline({
    variablesNames: plotConfig.variables as string[],
  });

  const { chartRef, legendRef, handleDownload } = useDownloadPlotAssets({
    runs: data.runs,
    title: plotConfig.title.replaceAll("|", " - ") || "plot",
    imageOptions: { padding: { all: 30 }, includeInFilename: true },
  });

  const [hasAutoDetected, setHasAutoDetected] = useState(false);

  useEffect(() => {
    if (!data.runs.length || hasAutoDetected) return;
    const hasNegatives = data.runs.some((r) => r.orderedPoints.some((p) => p.value < 0));
    setSingleYearChartType(
      hasNegatives ? PLOT_TYPE_OPTIONS.WATERFALL : PLOT_TYPE_OPTIONS.STACKED_BAR,
    );
    setHasAutoDetected(true);
  }, [data.runs, hasAutoDetected]);

  const renderChart = () => {
    if (!isSingleYear) {
      return <StackedAreaPlot data={data} variablesMap={plotConfig.variablesMap} />;
    }
    if (singleYearChartType === PLOT_TYPE_OPTIONS.WATERFALL) {
      return <WaterfallPlot data={data} variablesMap={plotConfig.variablesMap} />;
    }
    return <StackedBarPlot data={data} variablesMap={plotConfig.variablesMap} />;
  };

  return (
    <>
      <div className="flex w-full flex-col justify-between rounded-md bg-white p-4 select-none">
        <PlotWidgetHeader
          title={plotConfig.title}
          onDownload={handleDownload}
          onExpand={() => setIsDialogOpen(true)}
          chartType={isSingleYear ? singleYearChartType : undefined}
          onChange={isSingleYear ? setSingleYearChartType : undefined}
          toggleOptions={
            isSingleYear ? [PLOT_TYPE_OPTIONS.WATERFALL, PLOT_TYPE_OPTIONS.STACKED_BAR] : undefined
          }
        />
        <div ref={legendRef}>
          {data.runs[0] && <PlotLegend runs={data.runs} variablesMap={plotConfig.variablesMap} />}
        </div>
        <div ref={chartRef}>{renderChart()}</div>
      </div>

      <ChartDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title={plotConfig.title}>
        <div className="flex h-full w-full flex-col">
          <div>
            {data.runs[0] && <PlotLegend runs={data.runs} variablesMap={plotConfig.variablesMap} />}
          </div>
          <div className="relative min-h-0 flex-1 [&>*]:!aspect-auto [&>*]:!h-full">
            {isDialogOpen && renderChart()}
          </div>
        </div>
      </ChartDialog>
    </>
  );
}
