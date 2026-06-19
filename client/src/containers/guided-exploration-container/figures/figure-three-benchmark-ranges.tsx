"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { InfoIcon } from "lucide-react";

import {
  BenchmarkDataPoint,
  BENCHMARK_YEARS,
  FigureThreeData,
} from "@/hooks/guided-exploration/figure-three/use-figure-three";
import { BenchmarkGroupKey } from "@/components/plots/plot-variations/benchmark-chart/benchmark-chart.config";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/plots/format-functions";

const DEFAULT_BENCHMARK_YEAR = BENCHMARK_YEARS.find((year) => year !== 2020) ?? 2030;

type BenchmarkRange = {
  min: number;
  max: number;
  count: number;
} | null;

const BENCHMARK_RANGE_GROUPS: Array<{
  key: BenchmarkGroupKey;
  label: string;
  colorClassName: string;
  borderClassName: string;
}> = [
  {
    key: "groupA",
    label: "GW3",
    colorClassName: "text-[#4266C8]",
    borderClassName: "border-[#4266C8]/35",
  },
  {
    key: "groupB",
    label: "GW2+GW1",
    colorClassName: "text-[#3A9B3A]",
    borderClassName: "border-[#3A9B3A]/35",
  },
];

const getBenchmarkRange = (points: BenchmarkDataPoint[], year: number): BenchmarkRange => {
  const values = points.filter((point) => point.year === year).map((point) => point.pctChange);
  if (!values.length) return null;

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length,
  };
};

const formatBenchmarkRangeValue = (value: number, unit = "%"): string => {
  if (unit.toLowerCase() === "year") return Math.round(value).toString();
  if (unit === "%") return `${formatNumber(value, 2)}%`;
  if (!unit) return formatNumber(value);
  return formatNumber(value);
};

const formatBenchmarkRange = (range: BenchmarkRange, unit = "%"): string => {
  if (!range) return "No range";

  const min = formatBenchmarkRangeValue(range.min, unit);
  const max = formatBenchmarkRangeValue(range.max, unit);

  return min === max ? min : `${min} to ${max}`;
};

function BenchmarkRangeCard({
  label,
  range,
  valueUnit,
  colorClassName,
  borderClassName,
}: {
  label: string;
  range: BenchmarkRange;
  valueUnit: string;
  colorClassName: string;
  borderClassName: string;
}) {
  return (
    <div className={cn("rounded-md border p-3", borderClassName)}>
      <div className={cn("text-xs font-bold tracking-widest uppercase", colorClassName)}>
        {label}
      </div>
      <div className={cn("mt-1 text-2xl leading-tight font-bold", colorClassName)}>
        {formatBenchmarkRange(range, valueUnit)}
      </div>
      <div className="mt-2 text-xs text-stone-500">
        {range ? `${range.count} no-concern scenarios` : "No no-concern scenarios"}
      </div>
    </div>
  );
}

export function FigureThreeBenchmarkRanges({
  data,
  selectedYears,
  isMetaIndicator,
  resetKey,
}: {
  data: FigureThreeData;
  selectedYears: number[];
  isMetaIndicator: boolean;
  resetKey: number;
}) {
  const benchmarkYearOptions = useMemo(
    () => selectedYears.filter((year) => year !== 2020).sort((a, b) => a - b),
    [selectedYears],
  );

  const firstBenchmarkYear = benchmarkYearOptions[0] ?? DEFAULT_BENCHMARK_YEAR;
  const [benchmarkYear, setBenchmarkYear] = useState(firstBenchmarkYear);
  const previousResetKeyRef = useRef(resetKey);

  useEffect(() => {
    if (previousResetKeyRef.current === resetKey) return;

    previousResetKeyRef.current = resetKey;
    setBenchmarkYear(firstBenchmarkYear);
  }, [firstBenchmarkYear, resetKey]);

  useEffect(() => {
    if (isMetaIndicator || !benchmarkYearOptions.length) return;
    if (!benchmarkYearOptions.includes(benchmarkYear)) {
      setBenchmarkYear(firstBenchmarkYear);
    }
  }, [benchmarkYear, benchmarkYearOptions, firstBenchmarkYear, isMetaIndicator]);

  const benchmarkSummary = useMemo(() => {
    const summaryYear = isMetaIndicator ? (data.xValues?.[0] ?? 1) : benchmarkYear;
    const yearLabel = isMetaIndicator
      ? (data.xLabels?.[summaryYear] ?? "Meta-indicator")
      : summaryYear.toString();

    return {
      year: summaryYear,
      yearLabel,
      valueLabel: data.valueLabel ?? "Change",
      valueUnit: data.valueUnit ?? "%",
      ranges: {
        groupA: getBenchmarkRange(data.groupA.noConcern, summaryYear),
        groupB: getBenchmarkRange(data.groupB.noConcern, summaryYear),
      },
    };
  }, [benchmarkYear, data, isMetaIndicator]);

  return (
    <div className="mt-2 flex flex-col gap-3 rounded-lg bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label className="font-bold">Benchmark ranges</Label>
          <p className="mt-1 text-xs leading-4 text-stone-500">
            From scenarios without high feasibility or sustainability concerns
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Benchmark ranges explanation"
              className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              <InfoIcon size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="max-w-84">
            These ranges are calculated from the same no-concern scenarios shown as dots in the
            chart.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid gap-2">
        {BENCHMARK_RANGE_GROUPS.map((group) => (
          <BenchmarkRangeCard
            key={group.key}
            label={group.label}
            range={benchmarkSummary.ranges[group.key]}
            valueUnit={benchmarkSummary.valueUnit}
            colorClassName={group.colorClassName}
            borderClassName={group.borderClassName}
          />
        ))}
      </div>

      {!isMetaIndicator && benchmarkYearOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {benchmarkYearOptions.map((year) => {
            const isSelected = benchmarkSummary.year === year;

            return (
              <button
                key={year}
                type="button"
                onClick={() => setBenchmarkYear(year)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
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
      )}
    </div>
  );
}
