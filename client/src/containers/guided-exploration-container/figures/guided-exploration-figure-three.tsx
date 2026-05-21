"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import {
  useFigureThree,
  VARIABLE_PREFIX_FILTER,
  BENCHMARK_YEARS,
} from "@/hooks/guided-exploration/figure-three/use-figure-three";
import { BenchmarkChart } from "@/components/plots/plot-variations/benchmark-chart/benchmark-chart";
import { BenchmarkDotTooltipPoint } from "@/components/plots/plot-variations/benchmark-chart/render-benchmark-chart";
import { ComboboxVariableSelect } from "@/components/plots/components/variable-select/combobox-variable-select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import LoadingDots from "@/components/animations/loading-dots";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.webp";
import { cn } from "@/lib/utils";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";

const SELECTABLE_YEARS = BENCHMARK_YEARS.filter((year) => year !== 2020);

type BenchmarkPointWithRun = BenchmarkDotTooltipPoint & {
  point: BenchmarkDotTooltipPoint["point"] & {
    run?: Parameters<ReturnType<typeof useGetRunDetailsUrl>>[0];
  };
};

export function GuidedExplorationFigThree() {
  const { data, isLoading, isError, controls } = useFigureThree();

  const {
    variable,
    setVariable,
    selectedYears,
    setSelectedYears,
    showGroupA,
    setShowGroupA,
    showGroupB,
    setShowGroupB,
    showRangeBars,
    setShowRangeBars,
    showNoConcernDots,
    setShowNoConcernDots,
    includeUnvetted,
    setIncludeUnvetted,
    resetFigureThreeControls,
  } = controls;

  const [selectedPoint, setSelectedPoint] = useState<BenchmarkDotTooltipPoint | null>(null);

  const buildRunDetailsUrl = useGetRunDetailsUrl();

  const {
    data: variableOptions,
    isLoading: isVariablesLoading,
    isError: isVariablesError,
  } = useQuery({ ...queryKeys.variables.list() });

  const filteredVariableOptions = useMemo(() => {
    if (!variableOptions) return [];
    return variableOptions.filter((option) => option.name.startsWith(VARIABLE_PREFIX_FILTER));
  }, [variableOptions]);

  const handleVariableChange = (variableId: number) => {
    const match = variableOptions?.find((option) => option.id === variableId);
    if (match) setVariable(match.name);
  };

  const toggleYear = (year: number) => {
    setSelectedPoint(null);

    setSelectedYears(
      selectedYears.includes(year)
        ? selectedYears.filter((y) => y !== year)
        : [...selectedYears, year].sort((a, b) => a - b),
    );
  };

  const handlePointClick = (point: BenchmarkDotTooltipPoint) => {
    const pointWithRun = point as BenchmarkPointWithRun;

    if (pointWithRun.point.run) {
      window.open(buildRunDetailsUrl(pointWithRun.point.run), "_blank");
      return;
    }

    console.warn("Benchmark point is missing the full run object:", point);
  };

  const handleResetControls = async () => {
    setSelectedPoint(null);
    await resetFigureThreeControls();
  };

  const chartStateClasses =
    "flex h-full min-h-0 w-full items-center justify-center rounded-lg bg-white";

  return (
    <div className="bg-card my-8 rounded-xl p-6 select-none">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Chart */}
        <div className="border-compass-sand flex aspect-[4/3] max-h-[90vh] min-h-[520px] w-full min-w-0 rounded-lg border bg-white p-2">
          {isLoading && (
            <div className={chartStateClasses}>
              <LoadingDots />
            </div>
          )}

          {isError && (
            <div className={chartStateClasses}>
              <DataFetchError />
            </div>
          )}

          {!isLoading && !isError && !data && (
            <div className={chartStateClasses}>
              <div className="-mt-10 px-4 text-center">
                <Image
                  src={notFoundImage}
                  alt="No results"
                  width={160}
                  height={128}
                  className="mx-auto"
                />
                <p className="font-bold">No results available</p>
                <p className="leading-5 text-stone-600">
                  Try adjusting the filters to see results.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && data && (
            <BenchmarkChart
              data={data}
              selectedYears={selectedYears}
              showGroupA={showGroupA}
              showGroupB={showGroupB}
              showRangeBars={showRangeBars}
              showNoConcernDots={showNoConcernDots}
              selectedPoint={selectedPoint}
              onPointClick={handlePointClick}
              onSelectedPointChange={setSelectedPoint}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex max-w-md shrink-0 flex-col gap-6 md:w-80">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Variable</Label>
            <ComboboxVariableSelect
              isLoading={isVariablesLoading}
              isError={isVariablesError}
              options={filteredVariableOptions}
              value={filteredVariableOptions?.find((o) => o.name === variable)?.id}
              onSelectAction={(id) => handleVariableChange(Number(id))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-bold">Years</Label>
            <div className="flex flex-wrap gap-2">
              {SELECTABLE_YEARS.map((year) => {
                const isSelected = selectedYears.includes(year);

                return (
                  <button
                    key={year}
                    onClick={() => toggleYear(year)}
                    className={cn(
                      "rounded-full border px-3.5 py-1 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-stone-700",
                    )}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="font-bold">Scenario groups</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Switch
                  checked={showGroupA}
                  onCheckedChange={(checked) => {
                    setSelectedPoint(null);
                    setShowGroupA(checked);
                  }}
                />
                <span className="inline-block h-3 w-4 rounded-sm border border-[rgba(99,132,220,0.5)] bg-[rgba(99,132,220,0.35)]" />
                <Label className="font-normal">GW3b+GW3a</Label>
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={showGroupB}
                  onCheckedChange={(checked) => {
                    setSelectedPoint(null);
                    setShowGroupB(checked);
                  }}
                />
                <span className="inline-block h-3 w-4 rounded-sm border border-[rgba(134,193,134,0.5)] bg-[rgba(134,193,134,0.35)]" />
                <Label className="ont-normal">GW2b+GW2a+GW1</Label>
              </div>
            </div>
          </div>

          {/* Layers */}
          <div className="flex flex-col gap-4">
            <Label className="font-bold">Layers</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Switch
                  checked={showRangeBars}
                  onCheckedChange={(checked) => {
                    setSelectedPoint(null);
                    setShowRangeBars(checked);
                  }}
                />
                <Label className="font-normal">Range (all vetted)</Label>
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={showNoConcernDots}
                  onCheckedChange={(checked) => {
                    setSelectedPoint(null);
                    setShowNoConcernDots(checked);
                  }}
                />
                <Label className="font-normal">Dots (no concern)</Label>
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={includeUnvetted}
                  onCheckedChange={(checked) => {
                    setSelectedPoint(null);
                    setIncludeUnvetted(checked);
                  }}
                />
                <Label className="font-normal">Include unvetted</Label>
              </div>
            </div>
          </div>

          {/* Reset */}
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            onClick={handleResetControls}
            className="border-compass-sand border bg-white"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
