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
import PlotContentWrapper from "@/containers/scenario-dashboard/components/plot-widget/components/plot-content-wrapper";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { ComboboxVariableSelect } from "@/containers/scenario-dashboard/components/plot-widget/components/combobox-variable-select";
import { Variable } from "@iiasa/ixmp4-ts";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { VariableSelectWrapper } from "@/containers/scenario-dashboard/components/plot-widget/components/variable-select-wrapper";

interface Props {
  prefix?: string;
  isEnabled?: boolean;
  onVariableSelect?: (variableId: Variable["id"]) => void;
  index: number;
  initialChartType?: ChartType;
}

const queryKey = queryKeys.variables.list();

export function CustomSelectMultipleRunsPlotWidget({
  prefix,
  isEnabled,
  index,
  initialChartType = "area",
  onVariableSelect,
}: Props) {
  const {
    data: variableOptions,
    isError,
    isLoading,
  } = useQuery({
    ...queryKey,
  });
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const router = useRouter();
  const { setCustomVariable, getCustomVariable } = useTabAndVariablesParams(prefix);
  const selectedVariableIndex = getCustomVariable(index);
  const currentVariable = variableOptions?.find(
    (variable) => variable.id === selectedVariableIndex,
  );

  const data = useMultipleRunsPipeline({ variable: currentVariable?.name || "", prefix });

  useEffect(() => {
    setChartType(initialChartType);
  }, [initialChartType]);

  useEffect(() => {
    if (onVariableSelect && selectedVariableIndex) {
      onVariableSelect(selectedVariableIndex);
    }
  }, [onVariableSelect, selectedVariableIndex]);

  const handleRunClick = (run: ExtendedRun) => {
    router.push(`${INTERNAL_PATHS.SCENARIO_DASHBOARD}/${run.runId}`);
  };

  const handleVariableChange = (variableId: Variable["id"]) => {
    if (!selectedVariableIndex && onVariableSelect) {
      onVariableSelect(variableId);
    }
    setCustomVariable({
      plotIndex: index,
      variableId,
    });
  };

  const showChartTypeToggle = chartType !== PLOT_TYPE_OPTIONS.DOTS;

  if (!currentVariable) {
    return (
      <VariableSelectWrapper
        isLoading={isLoading}
        isError={isError}
        isEnabled={isEnabled}
        options={variableOptions}
        onVariableSelect={handleVariableChange}
      />
    );
  }

  return (
    <div className="h-fit w-full rounded-md bg-white p-4 select-none">
      <div className="flex items-center justify-between">
        <div className="mb-5 flex items-center gap-2.5">
          <p className="text-xs">Variable</p>
          <ComboboxVariableSelect
            isLoading={isLoading}
            isError={isError}
            options={variableOptions}
            value={currentVariable?.id}
            onSelectAction={handleVariableChange}
          />
        </div>
        <VariablePlotWidgetHeader
          chartType={chartType}
          onChange={showChartTypeToggle ? setChartType : undefined}
        />
      </div>
      <PlotContentWrapper
        chartType={chartType}
        data={data}
        prefix={prefix}
        onRunClick={handleRunClick}
      />
    </div>
  );
}
