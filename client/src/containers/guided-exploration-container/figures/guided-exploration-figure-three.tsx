"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import {
  useFigureThree,
  BENCHMARK_YEARS,
  FigureThreeMode,
  META_INDICATOR_VARIABLES,
  VARIABLES_ARRAY,
} from "@/hooks/guided-exploration/figure-three/use-figure-three";
import { BenchmarkChart } from "@/components/plots/plot-variations/benchmark-chart/benchmark-chart";
import { BenchmarkDotTooltipPoint } from "@/components/plots/plot-variations/benchmark-chart/render-benchmark-chart";
import { ComboboxVariableSelect } from "@/components/plots/components/variable-select/combobox-variable-select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LoadingDots from "@/components/animations/loading-dots";
import { DataFetchError } from "@/components/error-state/data-fetch-error";
import Image from "next/image";
import notFoundImage from "@/assets/images/not-found.webp";
import { cn } from "@/lib/utils";
import { useGetRunDetailsUrl } from "@/hooks/nuqs/url-params/use-get-run-details-url";
import { InfoIcon } from "lucide-react";

const SELECTABLE_YEARS = BENCHMARK_YEARS.filter((year) => year !== 2020);

const MODE_OPTIONS: Array<{ value: FigureThreeMode; label: string }> = [
  { value: "variable", label: "Variable" },
  { value: "meta", label: "Meta-indicator" },
];

type BenchmarkPointWithRun = BenchmarkDotTooltipPoint & {
  point: BenchmarkDotTooltipPoint["point"] & {
    run?: Parameters<ReturnType<typeof useGetRunDetailsUrl>>[0];
  };
};

function ScenarioGroupLabel({ label, explanation }: { label: string; explanation: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Label className="font-normal">{label}</Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`${label} explanation`}
            className="inline-flex size-5 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
          >
            <InfoIcon size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" className="max-w-84">
          {explanation}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

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
    mode,
    setMode,
    resetFigureThreeControls,
    metaIndicator,
    setMetaIndicator,
  } = controls;

  const [selectedPoint, setSelectedPoint] = useState<BenchmarkDotTooltipPoint | null>(null);

  const buildRunDetailsUrl = useGetRunDetailsUrl();
  const isMetaIndicator = mode === "meta";

  const {
    data: variableOptions,
    isLoading: isVariablesLoading,
    isError: isVariablesError,
  } = useQuery({ ...queryKeys.variables.list() });

  const filteredVariableOptions = useMemo(() => {
    if (!variableOptions) return [];
    return variableOptions.filter(
      (option) =>
        VARIABLES_ARRAY.includes(option.name) && !META_INDICATOR_VARIABLES.includes(option.name),
    );
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
              includeUnvetted={includeUnvetted}
              selectedPoint={selectedPoint}
              onPointClick={handlePointClick}
              onSelectedPointChange={setSelectedPoint}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex max-w-md shrink-0 flex-col gap-6 md:w-80">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Plot type</Label>
            <div className="border-compass-sand grid grid-cols-2 overflow-hidden rounded-md bg-white">
              {MODE_OPTIONS.map((option, index) => {
                const isSelected = mode === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedPoint(null);
                      setMode(option.value);
                    }}
                    className={cn(
                      "border px-3 py-2 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-black bg-black text-white"
                        : "text-black hover:bg-slate-50",
                      index == 0 && "rounded-l-md border-r-0",
                      index == 1 && "rounded-r-md border-l-0",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-bold">{isMetaIndicator ? "Meta-indicator" : "Variable"}</Label>
            {isMetaIndicator ? (
              <Select
                value={metaIndicator}
                onValueChange={(value) => {
                  setSelectedPoint(null);
                  setMetaIndicator(value);
                }}
              >
                <SelectTrigger className="w-full overflow-hidden text-xs" size="lg">
                  <SelectValue className="truncate" />
                </SelectTrigger>

                <SelectContent className="max-w-[--radix-select-trigger-width]">
                  {META_INDICATOR_VARIABLES.map((indicator) => (
                    <SelectItem key={indicator} value={indicator} className="text-xs">
                      <span className="block truncate">{indicator}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <ComboboxVariableSelect
                isLoading={isVariablesLoading}
                isError={isVariablesError}
                options={filteredVariableOptions}
                value={filteredVariableOptions?.find((o) => o.name === variable)?.id}
                onSelectAction={(id) => handleVariableChange(Number(id))}
              />
            )}
          </div>

          {!isMetaIndicator && (
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
          )}

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
                <ScenarioGroupLabel
                  label="GW3"
                  explanation="Peak warming likely below 2 °C (67% likelihood)"
                />
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
                <ScenarioGroupLabel
                  label="GW2+GW1"
                  explanation="Peak warming below 1.7 °C (50% likelihood)"
                />
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
