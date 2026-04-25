"use client";

import { useEffect, useRef, useState } from "react";
import { PlotWidgetHeader } from "@/components/plots/components";
import { ChartType, PLOT_TYPE_OPTIONS } from "@/components/plots/components";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-multiple-runs-for-variable-pipeline";
import { ExtendedRun } from "@/types/data/run";
import { useQuery } from "@tanstack/react-query";
import { ComboboxVariableSelect } from "@/components/plots/components";
import { Variable } from "@iiasa/ixmp4-ts";
import { useTabAndVariablesParams } from "@/hooks/nuqs/tabs/use-tabs-and-variables-params";
import { VariableSelectWrapper } from "@/components/plots/components";
import { AreaPlot, DotPlot } from "@/components/plots/plot-variations";
import { useDownloadPlotAssets } from "@/hooks/plots/download/use-download-plot-assets";
import queryKeys from "@/lib/query-keys";
import { CanvasMultiLinePlot } from "@/components/plots/plot-variations/canvas/canvas-multi-line-plot";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import { ChartDialog } from "@/components/custom/chart-dialog";

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
    ...queryKeys.variables.list(),
  });

  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedRunRef = useRef<ExtendedRun | null>(null);

  const buildRunDetailsUrl = useGetRunDetailsUrl();
  const { setCustomVariable, getCustomVariable } = useTabAndVariablesParams(prefix);
  const selectedVariableIndex = getCustomVariable(index);
  const currentVariable = variableOptions?.find((v) => v.id === selectedVariableIndex);

  const data = useGetMultipleRunsForVariablePipeline({
    variable: currentVariable?.name || "",
    prefix,
  });

  const { chartRef, handleDownload } = useDownloadPlotAssets({
    runs: data.runs,
    title: currentVariable?.name.replaceAll("|", " - ") || "plot",
    imageOptions: { padding: { all: 30 }, includeInFilename: true },
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
    window.open(buildRunDetailsUrl(run), "_blank");
  };

  const handleVariableChange = (variableId: Variable["id"]) => {
    if (!selectedVariableIndex && onVariableSelect) {
      onVariableSelect(variableId);
    }
    setCustomVariable({ plotIndex: index, variableId });
    selectedRunRef.current = null;
  };

  const renderChart = (zoomEnabled: boolean) => {
    if (chartType === PLOT_TYPE_OPTIONS.AREA) {
      return <AreaPlot data={data} prefix={prefix} />;
    }
    if (chartType === PLOT_TYPE_OPTIONS.DOTS) {
      return (
        <DotPlot
          data={data}
          prefix={prefix}
          onRunClick={handleRunClick}
          selectedRun={selectedRunRef.current}
          onSelectedRunChange={(run) => {
            selectedRunRef.current = run;
          }}
        />
      );
    }
    if (chartType === PLOT_TYPE_OPTIONS.MULTIPLE_LINE) {
      return (
        <CanvasMultiLinePlot
          data={data}
          prefix={prefix}
          zoomEnabled={zoomEnabled}
          onRunClick={handleRunClick}
          selectedRun={selectedRunRef.current}
          onSelectedRunChange={(run) => {
            selectedRunRef.current = run;
          }}
        />
      );
    }
    return null;
  };

  const variableSelectEl = (
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
  );

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
    <>
      <div className="h-fit w-full rounded-md bg-white p-4 select-none">
        <div className="flex flex-col justify-between">
          <PlotWidgetHeader
            chartType={chartType}
            onChange={chartType !== PLOT_TYPE_OPTIONS.DOTS ? setChartType : undefined}
            onDownload={handleDownload}
            onExpand={() => setIsDialogOpen(true)}
          />
          {variableSelectEl}
        </div>
        <div ref={chartRef}>{renderChart(false)}</div>
      </div>

      <ChartDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentVariable.name.replaceAll("|", " - ")}
      >
        <div className="flex h-full w-full flex-col">
          {variableSelectEl}
          <div className="relative min-h-0 flex-1 [&>*]:!aspect-auto [&>*]:!h-full">
            {isDialogOpen && renderChart(true)}
          </div>
        </div>
      </ChartDialog>
    </>
  );
}
