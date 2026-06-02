"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import {
  useFigureOne,
  FigureOneDataPoint,
} from "@/hooks/guided-exploration/figure-one/use-figure-one";
import { ScatterPlot } from "@/components/plots/plot-variations/scatter-plot/scatter-plot";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import GeographyFilter from "@/containers/scenario-dashboard-container/components/filter-top/geography-filter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SingleYearSelect } from "@/containers/scenario-dashboard-container/details-view/header/start-end-years-selection";
import { YEAR_OPTIONS } from "@/containers/scenario-dashboard-container/url-store";
import { ComboboxVariableSelect } from "@/components/plots/components/variable-select/combobox-variable-select";
import { Button } from "@/components/ui/button";

export function GuidedExplorationFigOne() {
  const {
    legendItems,
    data,
    isLoading: isChartLoading,
    isError: isChartError,
    year,
    setYear,
    xVariable,
    setXVariable,
    yVariable,
    setYVariable,
    xUnit,
    yUnit,
    resetFigureOneControls,
  } = useFigureOne();

  const {
    data: variableOptions,
    isLoading: isVariablesLoading,
    isError: isVariablesError,
  } = useQuery({
    ...queryKeys.variables.list(),
  });

  const [selectedPoint, setSelectedPoint] = useState<FigureOneDataPoint | null>(null);

  const buildRunDetailsUrl = useGetRunDetailsUrl();

  const handlePointClick = (point: FigureOneDataPoint) => {
    window.open(buildRunDetailsUrl(point.run), "_blank");
  };

  const handleVariableChange = (variableId: number, setter: (val: string) => void) => {
    const match = variableOptions?.find((v) => v.id === variableId);
    if (match) setter(match.name);
  };

  const handleResetControls = async () => {
    setSelectedPoint(null);
    await resetFigureOneControls();
  };

  const xLabel = xUnit ? `${xVariable} [${xUnit}]` : xVariable;
  const yLabel = yUnit ? `${yVariable} [${yUnit}]` : yVariable;

  return (
    <div className="bg-card my-8 rounded-xl p-6 select-none">
      <div className="flex gap-4">
        <div className="border-compass-sand flex aspect-[4/3] max-h-[90vh] min-h-0 w-full rounded-lg border bg-white p-2">
          <ScatterPlot
            points={data}
            isLoading={isChartLoading}
            isError={isChartError}
            onPointClick={handlePointClick}
            selectedPoint={selectedPoint}
            onSelectedPointChange={setSelectedPoint}
            xLabel={xLabel}
            yLabel={yLabel}
          />
        </div>

        <div className="flex h-full max-w-xs flex-col items-start justify-start gap-10">
          {/* Section 1 */}
          <div className="flex w-full flex-col gap-3">
            <div className="w-full">
              <GeographyFilter variant="dark" />
            </div>

            <div className="grid w-full items-end gap-4">
              <div className="flex flex-1 gap-6" data-testid="year-filter">
                <div className="flex w-full flex-col gap-2">
                  <Label
                    className="text-base leading-6 font-bold"
                    id="year-selection-label"
                    data-testid="year-selection-label"
                  >
                    Year
                  </Label>

                  <SingleYearSelect
                    value={year ?? null}
                    onChange={setYear}
                    placeholder="Select year"
                    options={YEAR_OPTIONS}
                    testId="start-year-select"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex w-full flex-wrap gap-3">
            <div className="flex min-w-[200px] flex-1 flex-col gap-2">
              <Label className="font-bold">X-Axis Variable</Label>

              <ComboboxVariableSelect
                isLoading={isVariablesLoading}
                isError={isVariablesError}
                options={variableOptions}
                value={variableOptions?.find((v) => v.name === xVariable)?.id}
                onSelectAction={(id) => handleVariableChange(id, setXVariable)}
              />
            </div>

            <div className="flex min-w-[200px] flex-1 flex-col gap-2">
              <Label className="text-base leading-6 font-bold">Y-Axis Variable</Label>

              <ComboboxVariableSelect
                isLoading={isVariablesLoading}
                isError={isVariablesError}
                options={variableOptions}
                value={variableOptions?.find((v) => v.name === yVariable)?.id}
                onSelectAction={(id) => handleVariableChange(id, setYVariable)}
              />
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-4">
            {legendItems.map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <Switch
                  id={`legend-${item.key}`}
                  checked={item.enabled}
                  onCheckedChange={item.toggle}
                  style={
                    {
                      "--switch-color": item.color,
                    } as React.CSSProperties
                  }
                />

                <Label
                  htmlFor={`legend-${item.key}`}
                  className="flex items-center gap-2 text-base text-black"
                >
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            onClick={handleResetControls}
            className="border-compass-sand w-full border bg-white"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
