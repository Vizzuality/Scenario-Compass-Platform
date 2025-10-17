"use client";

import { useEffect, useState } from "react";
import { PlotWidgetHeader } from "@/components/plots/components";
import { useRouter } from "next/navigation";
import { ChartType, PLOT_TYPE_OPTIONS } from "@/components/plots/components";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/pipeline/getters/use-get-multiple-runs-for-variable-pipeline";
import { INTERNAL_PATHS } from "@/lib/paths";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { useQuery } from "@tanstack/react-query";
import { ComboboxVariableSelect } from "@/components/plots/components";
import { Variable } from "@iiasa/ixmp4-ts";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";
import { VariableSelectWrapper } from "@/components/plots/components";
import { AreaPlot, MultiLinePlot } from "@/components/plots/plot-variations";
import { usePlotDownload } from "@/hooks/plots/download/use-plot-download";

interface Props {
  prefix?: string;
  isEnabled?: boolean;
  onVariableSelect?: (variableId: Variable["id"]) => void;
  index: number;
  initialChartType?: ChartType;
}

export function CustomMultipleRunsPlotWidget({
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
    queryKey: ["localVariables"],
    queryFn: async () => {
      const response = await fetch("/variables.json");
      if (!response.ok) {
        throw new Error("Failed to fetch variables");
      }
      const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      return data as Variable[];
    },
  });

  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const router = useRouter();
  const { setCustomVariable, getCustomVariable } = useTabAndVariablesParams(prefix);
  const selectedVariableIndex = getCustomVariable(index);

  const currentVariable = variableOptions?.find(
    (variable) => variable.id === selectedVariableIndex,
  );
  const data = useGetMultipleRunsForVariablePipeline({
    variable: currentVariable?.name || "",
    prefix,
  });

  const { chartRef, handleDownload } = usePlotDownload({
    runs: data.runs,
    title: currentVariable?.name || "plot",
    imageOptions: {
      padding: { all: 30 },
      includeInFilename: true,
    },
  });

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
        <PlotWidgetHeader
          chartType={chartType}
          onChange={showChartTypeToggle ? setChartType : undefined}
          onDownload={handleDownload}
        />
      </div>
      <div ref={chartRef}>
        {chartType === PLOT_TYPE_OPTIONS.AREA && <AreaPlot data={data} prefix={prefix} />}
        {chartType === PLOT_TYPE_OPTIONS.MULTIPLE_LINE && (
          <MultiLinePlot data={data} prefix={prefix} onRunClick={handleRunClick} />
        )}
      </div>
    </div>
  );
}
