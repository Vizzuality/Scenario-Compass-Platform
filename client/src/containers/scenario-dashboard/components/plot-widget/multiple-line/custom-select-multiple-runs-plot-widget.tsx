"use client";

import Image from "next/image";
import tapImage from "@/assets/images/tap-image.png";
import { useEffect, useState } from "react";
import { VariablePlotWidgetHeader } from "@/containers/scenario-dashboard/components/plot-widget/components/variable-plot-widget-header";
import { useRouter } from "next/navigation";
import {
  ChartType,
  PLOT_TYPE_OPTIONS,
} from "@/containers/scenario-dashboard/components/plot-widget/components/chart-type-toggle";
import { useMultipleRunsPipeline } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { INTERNAL_PATHS } from "@/lib/paths";
import PlotContent from "@/containers/scenario-dashboard/components/plot-widget/components/plot-widget-content";
import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { ComboboxVariableSelect } from "@/containers/scenario-dashboard/components/plot-widget/components/combobox-variable-select";
import { Variable } from "@iiasa/ixmp4-ts";
import { useTabAndVariablesParams } from "@/hooks/nuqs/use-tabs-and-variables-params";

interface Props {
  prefix?: string;
  index: number;
  initialChartType?: ChartType;
}

// @TODO: refactor to avoid duplication with runs-panel

const queryKey = queryKeys.variables.list();

export function CustomSelectMultipleRunsPlotWidget({
  prefix,
  index,
  initialChartType = "area",
}: Props) {
  const { data: variableOptions, isSuccess } = useQuery({
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

  const handleRunClick = (run: ExtendedRun) => {
    router.push(`${INTERNAL_PATHS.SCENARIO_DASHBOARD}/${run.runId}`);
  };

  const handleVariableChange = (variableId: Variable["id"]) => {
    setCustomVariable({
      plotIndex: index,
      variableId,
    });
  };

  const showChartTypeToggle = chartType !== PLOT_TYPE_OPTIONS.DOTS;

  return (
    <>
      {currentVariable && isSuccess ? (
        <div className="h-fit w-full rounded-md bg-white p-4 select-none">
          <div className="flex items-center justify-between">
            <div className="mb-5 flex items-center gap-2.5">
              <p className="text-xs">Variable</p>
              <ComboboxVariableSelect
                options={variableOptions}
                value={currentVariable.id}
                onSelectAction={handleVariableChange}
              />
            </div>
            <VariablePlotWidgetHeader
              chartType={chartType}
              onChange={showChartTypeToggle ? setChartType : undefined}
            />
          </div>
          <PlotContent
            chartType={chartType}
            data={data}
            prefix={prefix}
            onRunClick={handleRunClick}
          />
        </div>
      ) : (
        <VariableSelectWrapper options={variableOptions} onVariableSelect={handleVariableChange} />
      )}
    </>
  );
}

interface VariableSelectWrapperProps {
  options: Variable[] | undefined;
  onVariableSelect: (variableId: Variable["id"]) => void;
}

const VariableSelectWrapper = ({ options, onVariableSelect }: VariableSelectWrapperProps) => {
  return (
    <div className="flex h-88 w-full flex-col items-center justify-center rounded-md border border-dashed bg-white p-4 select-none">
      <div className="flex max-w-md flex-col items-center text-center">
        <Image src={tapImage} alt="Tap to select variable" width={120} height={120} />
        <div className="mb-4 space-y-2">
          <strong className="block">Select a variable</strong>
          <p>
            To get started, choose a variable to explore its data through an interactive
            visualization.
          </p>
        </div>
        <ComboboxVariableSelect options={options} onSelectAction={onVariableSelect} />
      </div>
    </div>
  );
};
