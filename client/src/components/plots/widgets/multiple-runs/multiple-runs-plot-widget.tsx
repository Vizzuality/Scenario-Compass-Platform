"use client";

import { useEffect, useState } from "react";
import { PlotWidgetHeader } from "@/components/plots/components";
import { useRouter } from "next/navigation";
import { ChartType, PLOT_TYPE_OPTIONS } from "@/components/plots/components";
import { useMultipleRunsPipeline } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { INTERNAL_PATHS } from "@/lib/paths";
import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { VariableSelect } from "@/components/plots/components";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { AreaPlot, DotPlot, MultiLinePlot } from "@/components/plots/plot-variations";
import { useDownloadPlotImage } from "@/hooks/plots/use-download-plot-image";

interface Props {
  plotConfig: PlotConfig;
  prefix?: string;
  initialChartType?: ChartType;
}

export function MultipleRunsPlotWidget({ plotConfig, prefix, initialChartType = "area" }: Props) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const { getVariable, setVariable } = useTabAndVariablesParams(prefix);
  const currentVariable = getVariable(plotConfig);
  const data = useMultipleRunsPipeline({ variable: currentVariable, prefix });
  const router = useRouter();
  const { chartRef, downloadChart } = useDownloadPlotImage();

  useEffect(() => {
    setChartType(initialChartType);
  }, [initialChartType]);

  const handleVariableChange = (variable: string) => {
    setVariable(plotConfig, variable);
  };

  const handleRunClick = (run: ExtendedRun) => {
    const params = new URLSearchParams(window.location.search);
    router.push(`${INTERNAL_PATHS.SCENARIO_DASHBOARD}/${run.runId}?${params.toString()}`);
  };

  const showChartTypeToggle = chartType !== PLOT_TYPE_OPTIONS.DOTS;

  const handleDownload = () => {
    if (!plotConfig.title) return;
    downloadChart(plotConfig.title, undefined, {
      padding: { all: 30 },
      includeInFilename: true,
    });
  };

  return (
    <div className="h-fit w-full rounded-md bg-white p-4 select-none">
      <PlotWidgetHeader
        title={plotConfig.title}
        chartType={chartType}
        onChange={showChartTypeToggle ? setChartType : undefined}
        onDownload={handleDownload}
      />
      <VariableSelect
        options={plotConfig.variables}
        onChange={handleVariableChange}
        currentVariable={currentVariable}
      />
      <div ref={chartRef}>
        {chartType === PLOT_TYPE_OPTIONS.AREA && <AreaPlot data={data} />}
        {chartType === PLOT_TYPE_OPTIONS.DOTS && <DotPlot data={data} />}
        {chartType === PLOT_TYPE_OPTIONS.MULTIPLE_LINE && (
          <MultiLinePlot data={data} prefix={prefix} onRunClick={handleRunClick} />
        )}
      </div>
    </div>
  );
}
