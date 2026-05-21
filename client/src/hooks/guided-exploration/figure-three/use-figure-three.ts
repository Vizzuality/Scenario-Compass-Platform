"use client";

import { useCallback, useMemo } from "react";
import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-multiple-runs-for-variable-pipeline";
import { buildGroupData } from "@/hooks/guided-exploration/figure-three/figure-three-hook-utils";
import { ExtendedRun } from "@/types/data/run";

export const FIG_THREE_PREFIX = "fig3";
export const BENCHMARK_YEARS = [2030, 2035, 2040, 2050];
export const DEFAULT_VARIABLE = "Primary Energy|Fossil";
export const VARIABLE_PREFIX_FILTER = "Primary Energy|Fossil";

const DEFAULT_SELECTED_YEARS = [2030, 2035, 2040, 2050];

export interface BenchmarkDataPoint {
  year: number;
  pctChange: number;
  runId: string;
  run: ExtendedRun;
}

export interface GroupBenchmarkData {
  label: string;
  allVetted: BenchmarkDataPoint[];
  noConcern: BenchmarkDataPoint[];
}

export interface FigureThreeData {
  groupA: GroupBenchmarkData;
  groupB: GroupBenchmarkData;
}

export interface FigureThreeControls {
  selectedYears: number[];
  setSelectedYears: (years: number[] | null) => Promise<URLSearchParams>;
  showGroupA: boolean;
  setShowGroupA: (value: boolean | null) => Promise<URLSearchParams>;
  showGroupB: boolean;
  setShowGroupB: (value: boolean | null) => Promise<URLSearchParams>;
  showRangeBars: boolean;
  setShowRangeBars: (value: boolean | null) => Promise<URLSearchParams>;
  showNoConcernDots: boolean;
  setShowNoConcernDots: (value: boolean | null) => Promise<URLSearchParams>;
  includeUnvetted: boolean;
  setIncludeUnvetted: (value: boolean | null) => Promise<URLSearchParams>;
  variable: string;
  setVariable: (value: string | null) => Promise<URLSearchParams>;
  resetFigureThreeControls: () => Promise<void>;
}

export function useFigureThree() {
  const [variable, setVariable] = useQueryState(
    `${FIG_THREE_PREFIX}Var`,
    parseAsString.withDefault(DEFAULT_VARIABLE),
  );

  const [selectedYears, setSelectedYears] = useQueryState(
    `${FIG_THREE_PREFIX}Years`,
    parseAsArrayOf(parseAsInteger).withDefault(DEFAULT_SELECTED_YEARS),
  );

  const [showGroupA, setShowGroupA] = useQueryState(
    `${FIG_THREE_PREFIX}GroupA`,
    parseAsBoolean.withDefault(true),
  );

  const [showGroupB, setShowGroupB] = useQueryState(
    `${FIG_THREE_PREFIX}GroupB`,
    parseAsBoolean.withDefault(true),
  );

  const [showRangeBars, setShowRangeBars] = useQueryState(
    `${FIG_THREE_PREFIX}Range`,
    parseAsBoolean.withDefault(true),
  );

  const [showNoConcernDots, setShowNoConcernDots] = useQueryState(
    `${FIG_THREE_PREFIX}Dots`,
    parseAsBoolean.withDefault(true),
  );

  const [includeUnvetted, setIncludeUnvetted] = useQueryState(
    `${FIG_THREE_PREFIX}Unvetted`,
    parseAsBoolean.withDefault(false),
  );

  const { runs, isLoading, isError } = useGetMultipleRunsForVariablePipeline({
    variable,
    prefix: FIG_THREE_PREFIX,
    defaults: {
      startYear: 2020,
      endYear: 2050,
    },
  });

  const data = useMemo((): FigureThreeData | null => {
    if (!runs?.length) return null;
    return {
      groupA: buildGroupData(runs, ["GW3"], "GW3b+GW3a", selectedYears, includeUnvetted),
      groupB: buildGroupData(runs, ["GW1", "GW2"], "GW2b+GW2a+GW1", selectedYears, includeUnvetted),
    };
  }, [runs, selectedYears, includeUnvetted]);

  const resetFigureThreeControls = useCallback(async (): Promise<void> => {
    await Promise.all([
      setVariable(null),
      setSelectedYears(null),
      setShowGroupA(null),
      setShowGroupB(null),
      setShowRangeBars(null),
      setShowNoConcernDots(null),
      setIncludeUnvetted(null),
    ]);
  }, [
    setVariable,
    setSelectedYears,
    setShowGroupA,
    setShowGroupB,
    setShowRangeBars,
    setShowNoConcernDots,
    setIncludeUnvetted,
  ]);

  const controls: FigureThreeControls = {
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
    variable,
    setVariable,
    resetFigureThreeControls,
  };

  return { data, isLoading, isError, controls };
}
