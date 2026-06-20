"use client";

import { useState, useMemo } from "react";
import { ChartType, PlotWidgetHeader, PLOT_TYPE_OPTIONS } from "@/components/plots/components";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-multiple-runs-for-variable-pipeline";
import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { VariableSelect } from "@/components/plots/components";
import { ExtendedRun } from "@/types/data/run";
import { useTabAndVariablesParams } from "@/hooks/nuqs/tabs/use-tabs-and-variables-params";
import { AreaPlot, DotPlot } from "@/components/plots/plot-variations";
import { useDownloadPlotAssets } from "@/hooks/plots/download/use-download-plot-assets";
import { ChartDialog } from "@/components/custom/chart-dialog";
import { CanvasMultiLinePlot } from "@/components/plots/plot-variations/canvas/canvas-multi-line-plot";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import { YExtentPair } from "@/components/plots/plot-variations/canvas/scales";
import { useSelectedRunParam } from "@/hooks/nuqs/url-params/use-selected-run-param";
import { ChartWrapper } from "@/components/plots/chart-wrapper";

interface Props {
  plotConfig: PlotConfig;
  prefix?: string;
  initialChartType?: ChartType;
  yExtent?: YExtentPair;
}

export function MultipleRunsPlotWidget({
  plotConfig,
  prefix,
  initialChartType = "area",
  yExtent,
}: Props) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedRunId, setSelectedRunId } = useSelectedRunParam(prefix);

  const buildRunDetailsUrl = useGetRunDetailsUrl();
  const { getVariable, setVariable } = useTabAndVariablesParams(prefix);
  const currentVariable = getVariable(plotConfig);
  const data = useGetMultipleRunsForVariablePipeline({ variable: currentVariable, prefix });
  const dataRuns = data.runs;

  const selectedRun = useMemo(() => {
    if (!selectedRunId) return null;
    return dataRuns.find((r) => r.runId === selectedRunId) || null;
  }, [selectedRunId, dataRuns]);

  const { chartRef, handleDownload } = useDownloadPlotAssets({
    runs: dataRuns,
    title: currentVariable.replaceAll("|", " - "),
    imageOptions: { padding: { all: 30 }, includeInFilename: true },
  });

  const handleRunClick = (run: ExtendedRun) => {
    window.open(buildRunDetailsUrl(run), "_blank");
  };

  const handleVariableChange = (variable: string) => {
    setSelectedRunId(null);
    setVariable(plotConfig, variable);
  };

  const handleSelectedRunChange = (run: ExtendedRun | null) => {
    setSelectedRunId(run ? run.runId : null);
  };

  const renderChart = (zoomEnabled: boolean) => {
    switch (chartType) {
      case PLOT_TYPE_OPTIONS.AREA:
        return <AreaPlot data={data} prefix={prefix} yExtent={yExtent} />;
      case PLOT_TYPE_OPTIONS.DOTS:
        return (
          <DotPlot
            data={data}
            prefix={prefix}
            onRunClick={handleRunClick}
            selectedRun={selectedRun}
            onSelectedRunChange={handleSelectedRunChange}
            yExtent={yExtent}
          />
        );
      case PLOT_TYPE_OPTIONS.MULTIPLE_LINE:
        return (
          <CanvasMultiLinePlot
            data={data}
            zoomEnabled={zoomEnabled}
            prefix={prefix}
            onRunClick={handleRunClick}
            selectedRun={selectedRun}
            onSelectedRunChange={handleSelectedRunChange}
            yExtent={yExtent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex h-full w-full flex-col rounded-md bg-white p-4 select-none">
        <PlotWidgetHeader
          title={plotConfig.title}
          chartType={chartType}
          onChange={chartType !== PLOT_TYPE_OPTIONS.DOTS ? setChartType : undefined}
          onDownload={handleDownload}
          onExpand={() => setIsDialogOpen(true)}
        />
        <VariableSelect
          options={plotConfig.variables}
          onChange={handleVariableChange}
          currentVariable={currentVariable}
        />
        <ChartWrapper ref={chartRef}>{renderChart(false)}</ChartWrapper>
      </div>

      <ChartDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title={plotConfig.title}>
        <div className="flex h-full w-full flex-col">
          <VariableSelect
            options={plotConfig.variables}
            onChange={(v) => setVariable(plotConfig, v)}
            currentVariable={currentVariable}
          />
          <div className="relative min-h-0 flex-1">{isDialogOpen && renderChart(true)}</div>
        </div>
      </ChartDialog>
    </>
  );
}
