"use client";

import { useEffect, useState } from "react";
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

interface Props {
  plotConfig: PlotConfig;
  prefix?: string;
  initialChartType?: ChartType;
}

export function MultipleRunsPlotWidget({ plotConfig, prefix, initialChartType = "area" }: Props) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { geography, startYear, endYear } = useBaseUrlParams();
  const { getVariable, setVariable } = useTabAndVariablesParams(prefix);
  const currentVariable = getVariable(plotConfig);
  const data = useGetMultipleRunsForVariablePipeline({ variable: currentVariable, prefix });
  const router = useRouter();
  const { chartRef, handleDownload } = useDownloadPlotAssets({
    runs: data.runs,
    title: currentVariable.replaceAll("|", " - "),
    imageOptions: {
      padding: { all: 30 },
      includeInFilename: true,
    },
  });

  useEffect(() => {
    setChartType(initialChartType);
  }, [initialChartType]);

  const handleVariableChange = (variable: string) => {
    setVariable(plotConfig, variable);
  };

  const handleRunClick = (run: ExtendedRun) => {
    const params = new URLSearchParams();

    params.set("model", run.modelName);
    params.set("scenario", run.scenarioName);

    if (geography) params.set("geography", geography);
    if (startYear) params.set("startYear", startYear);
    if (endYear) params.set("endYear", endYear);

    router.push(`${INTERNAL_PATHS.RUN_DASHBOARD_EXPLORATION}?${params.toString()}`);
  };

  const showChartTypeToggle = chartType !== PLOT_TYPE_OPTIONS.DOTS;

  const renderChart = (isZoomed: boolean) => {
    if (chartType === PLOT_TYPE_OPTIONS.AREA) {
      return <AreaPlot data={data} prefix={prefix} />;
    }
    if (chartType === PLOT_TYPE_OPTIONS.DOTS) {
      return <DotPlot data={data} />;
    }
    if (chartType === PLOT_TYPE_OPTIONS.MULTIPLE_LINE) {
      return (
        <CanvasMultiLinePlot
          data={data}
          showZoomControls={isZoomed}
          prefix={prefix}
          onRunClick={handleRunClick}
        />
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex h-full w-full flex-col rounded-md bg-white p-4 select-none">
        <PlotWidgetHeader
          title={plotConfig.title}
          chartType={chartType}
          onChange={showChartTypeToggle ? setChartType : undefined}
          onDownload={handleDownload}
          onExpand={() => setIsDialogOpen(true)}
        />
        <VariableSelect
          options={plotConfig.variables}
          onChange={handleVariableChange}
          currentVariable={currentVariable}
        />
        <div ref={chartRef} className="min-h-0 flex-1">
          {renderChart(false)}
        </div>
      </div>

      <ChartDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} title={plotConfig.title}>
        <div className="flex h-full w-full flex-col">
          <div className="mb-4">
            <VariableSelect
              options={plotConfig.variables}
              onChange={handleVariableChange}
              currentVariable={currentVariable}
            />
          </div>
          <div className="min-h-0 flex-1">{renderChart(true)}</div>
        </div>
      </ChartDialog>
    </>
  );
}
