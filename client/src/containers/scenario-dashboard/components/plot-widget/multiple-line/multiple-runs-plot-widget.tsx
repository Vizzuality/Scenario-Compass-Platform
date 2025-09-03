"use client";

import { useEffect, useState } from "react";
import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/components/variable-plot-widget-header";
import { useRouter } from "next/navigation";
import {
  ChartType,
  PLOT_TYPE_OPTIONS,
} from "@/containers/scenario-dashboard/components/plot-widget/components/chart-type-toggle";
import { useMultipleRunsPipeline } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { INTERNAL_PATHS } from "@/lib/paths";
import { PlotConfig } from "@/lib/config/tabs/variables-config";
import { VariableSelect } from "@/containers/scenario-dashboard/components/plot-widget/components/variable-select";
import PlotContentWrapper from "@/containers/scenario-dashboard/components/plot-widget/components/plot-content-wrapper";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";

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

  return (
    <div className="h-fit w-full rounded-md bg-white p-4 select-none">
      <VariablePlotWidgetHeader
        title={plotConfig.title}
        chartType={chartType}
        onChange={showChartTypeToggle ? setChartType : undefined}
      />
      <VariableSelect
        options={plotConfig.variables}
        onChange={handleVariableChange}
        currentVariable={currentVariable}
      />
      <PlotContentWrapper
        chartType={chartType}
        data={data}
        prefix={prefix}
        onRunClick={handleRunClick}
      />
    </div>
  );
}
