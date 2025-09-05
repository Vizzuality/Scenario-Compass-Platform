"use client";

import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/components/variable-plot-widget-header";
import PlotContent from "@/containers/scenario-dashboard/components/plot-widget/components/plot-widget-content";
import { useSingleRunPipeline } from "@/hooks/runs/pipeline/use-single-run-pipeline";
import { PLOT_TYPE_OPTIONS } from "@/containers/scenario-dashboard/components/plot-widget/components/chart-type-toggle";
import { PlotConfig } from "@/lib/config/variables-config";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { VariableSelect } from "@/containers/scenario-dashboard/components/plot-widget/components/variable-select";

interface Props {
  runId: number;
  plotConfig: PlotConfig;
}

export function SingleRunPlotWidget({ runId, plotConfig }: Props) {
  const { getVariable, setVariable } = useTabAndVariablesParams();
  const currentVariable = getVariable(plotConfig);
  const data = useSingleRunPipeline({ runId, variable: currentVariable });
  const handleVariableChange = (variable: string) => {
    setVariable(plotConfig, variable);
  };

  return (
    <div className="w-full rounded-md bg-white p-4 select-none">
      <VariablePlotWidgetHeader
        title={plotConfig.title}
        chartType={PLOT_TYPE_OPTIONS.SINGLE_LINE}
      />
      <VariableSelect
        options={plotConfig.variables}
        onChange={handleVariableChange}
        currentVariable={currentVariable}
      />
      <PlotContent chartType={PLOT_TYPE_OPTIONS.SINGLE_LINE} data={data} />
    </div>
  );
}
