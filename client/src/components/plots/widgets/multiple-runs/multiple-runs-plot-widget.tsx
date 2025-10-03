"use client";

import { useEffect, useState } from "react";
import { PlotWidgetHeader } from "@/components/plots/components";
import { useRouter } from "next/navigation";
import { ChartType, PLOT_TYPE_OPTIONS } from "@/components/plots/components";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/pipeline/getters/use-get-multiple-runs-for-variable-pipeline";
import { INTERNAL_PATHS } from "@/lib/paths";
import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { VariableSelect } from "@/components/plots/components";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { AreaPlot, DotPlot, MultiLinePlot } from "@/components/plots/plot-variations";
import { usePlotDownload } from "@/hooks/plots/download/use-plot-download";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";

interface Props {
  plotConfig: PlotConfig;
  prefix?: string;
  initialChartType?: ChartType;
}

export function MultipleRunsPlotWidget({ plotConfig, prefix, initialChartType = "area" }: Props) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const { geography, startYear, endYear } = useBaseUrlParams();
  const { getVariable, setVariable } = useTabAndVariablesParams(prefix);
  const currentVariable = getVariable(plotConfig);
  const data = useGetMultipleRunsForVariablePipeline({ variable: currentVariable, prefix });
  const router = useRouter();
  const { chartRef, handleDownload } = usePlotDownload({
    runs: data.runs,
    title: currentVariable,
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
        {chartType === PLOT_TYPE_OPTIONS.AREA && <AreaPlot data={data} prefix={prefix} />}
        {chartType === PLOT_TYPE_OPTIONS.DOTS && <DotPlot data={data} />}
        {chartType === PLOT_TYPE_OPTIONS.MULTIPLE_LINE && (
          <MultiLinePlot data={data} prefix={prefix} onRunClick={handleRunClick} />
        )}
      </div>
    </div>
  );
}
