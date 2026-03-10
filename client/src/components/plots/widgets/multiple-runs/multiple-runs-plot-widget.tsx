"use client";

import { useState } from "react";
import { PlotWidgetHeader } from "@/components/plots/components";
import { useRouter } from "next/navigation";
import { ChartType, PLOT_TYPE_OPTIONS } from "@/components/plots/components";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-multiple-runs-for-variable-pipeline";
import { INTERNAL_PATHS } from "@/lib/paths";
import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { VariableSelect } from "@/components/plots/components";
import { ExtendedRun } from "@/types/data/run";
import { useTabAndVariablesParams } from "@/hooks/nuqs/tabs/use-tabs-and-variables-params";
import { AreaPlot, DotPlot } from "@/components/plots/plot-variations";
import { useDownloadPlotAssets } from "@/hooks/plots/download/use-download-plot-assets";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { ChartDialog } from "@/components/custom/chart-dialog";
import { CanvasMultiLinePlot } from "@/components/plots/plot-variations/canvas/canvas-multi-line-plot";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";

interface Props {
  plotConfig: PlotConfig;
  prefix?: string;
  initialChartType?: ChartType;
}

export function MultipleRunsPlotWidget({ plotConfig, prefix, initialChartType = "area" }: Props) {
  // Use key to reset chart type when initialChartType changes from parent
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { geography, startYear, endYear } = useBaseUrlParams();
  const buildRunDetailsUrl = useGetRunDetailsUrl();
  const { getVariable, setVariable } = useTabAndVariablesParams(prefix);
  const currentVariable = getVariable(plotConfig);
  const data = useGetMultipleRunsForVariablePipeline({ variable: currentVariable, prefix });
  const router = useRouter();
  const { chartRef, handleDownload } = useDownloadPlotAssets({
    runs: data.runs,
    title: currentVariable.replaceAll("|", " - "),
    imageOptions: { padding: { all: 30 }, includeInFilename: true },
  });

  const handleRunClick = (run: ExtendedRun) => {
    const url = buildRunDetailsUrl(run);
    router.push(url);
  };

  const renderChart = (enableZoom: boolean) => {
    switch (chartType) {
      case PLOT_TYPE_OPTIONS.AREA:
        return <AreaPlot key="area" data={data} prefix={prefix} />;
      case PLOT_TYPE_OPTIONS.DOTS:
        return <DotPlot key="dots" data={data} />;
      case PLOT_TYPE_OPTIONS.MULTIPLE_LINE:
        return (
          <CanvasMultiLinePlot
            key="multiline"
            data={data}
            zoomEnabled={enableZoom}
            prefix={prefix}
            onRunClick={handleRunClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        key={chartType}
        className="flex h-full w-full flex-col rounded-md bg-white p-4 select-none"
      >
        <PlotWidgetHeader
          title={plotConfig.title}
          chartType={chartType}
          onChange={chartType !== PLOT_TYPE_OPTIONS.DOTS ? setChartType : undefined}
          onDownload={handleDownload}
          onExpand={() => setIsDialogOpen(true)}
        />
        <VariableSelect
          options={plotConfig.variables}
          onChange={(v) => setVariable(plotConfig, v)}
          currentVariable={currentVariable}
        />
        <div ref={chartRef} className="min-h-0 flex-1">
          {renderChart(false)}
        </div>
      </div>

      <ChartDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title={plotConfig.title}>
        <div className="flex h-full w-full flex-col">
          <VariableSelect
            options={plotConfig.variables}
            onChange={(v) => setVariable(plotConfig, v)}
            currentVariable={currentVariable}
          />
          <div className="relative min-h-0 flex-1 [&>*]:!aspect-auto [&>*]:!h-full">
            {isDialogOpen && renderChart(false)}
          </div>
        </div>
      </ChartDialog>
    </>
  );
}
