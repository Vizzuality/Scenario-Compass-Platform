"use client";

import { useCallback, useMemo } from "react";
import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-multiple-runs-for-variable-pipeline";
import {
  buildGroupData,
  buildMetaIndicatorGroupData,
  getVariableBaselineYear,
} from "@/hooks/guided-exploration/figure-three/figure-three-hook-utils";
import { ExtendedRun } from "@/types/data/run";
import {
  CUMULATIVE_CO2_NET_NEGATIVE_EMISSIONS_META_INDICATOR_KEY,
  YEAR_NET_ZERO_CO2_META_INDICATOR_KEY,
} from "@/lib/config/filters/climate-filter-config";

export const FIG_THREE_PREFIX = "fig3";
export const BENCHMARK_YEARS = [2030, 2035, 2040, 2050];
export const DEFAULT_VARIABLE = "Primary Energy|Fossil";
export const COMBINED_CO2_EMISSIONS_VARIABLE = "Emissions|CO2|Energy and Industrial Processes";
export const FIGURE_THREE_META_RUNSET_VARIABLE = COMBINED_CO2_EMISSIONS_VARIABLE;
export const META_INDICATOR_BUCKET = 1;
export type FigureThreeMode = "variable" | "meta";

export const META_INDICATOR_VARIABLES = [
  YEAR_NET_ZERO_CO2_META_INDICATOR_KEY,
  CUMULATIVE_CO2_NET_NEGATIVE_EMISSIONS_META_INDICATOR_KEY,
];

const META_INDICATOR_LABELS: Record<string, string> = {
  [YEAR_NET_ZERO_CO2_META_INDICATOR_KEY]: "Net zero CO2",
  [CUMULATIVE_CO2_NET_NEGATIVE_EMISSIONS_META_INDICATOR_KEY]: "Net-Negative CO2",
};

const META_INDICATOR_UNITS: Record<string, string> = {
  [YEAR_NET_ZERO_CO2_META_INDICATOR_KEY]: "Year",
  [CUMULATIVE_CO2_NET_NEGATIVE_EMISSIONS_META_INDICATOR_KEY]: "Gt CO2",
};

export const VARIABLES_ARRAY = [
  // Energy
  "Primary Energy|Fossil",
  "Primary Energy|Coal",
  "Primary Energy|Oil",
  "Primary Energy|Gas",
  "Primary Energy|Non-Biomass Renewables",
  // Emissions
  "Emissions|Kyoto Gases",
  "Emissions|N2O",
  "Emissions|CH4",
  COMBINED_CO2_EMISSIONS_VARIABLE,
];

const DEFAULT_SELECTED_YEARS = [2030, 2035, 2040, 2050];
const DEFAULT_META_INDICATOR = META_INDICATOR_VARIABLES[0];

export interface BenchmarkDataPoint {
  year: number;
  pctChange: number;
  runId: string;
  run: ExtendedRun;
}

export interface GroupBenchmarkData {
  label: string;
  allVetted: BenchmarkDataPoint[];
  withUnvetted: BenchmarkDataPoint[];
  noConcern: BenchmarkDataPoint[];
}

export interface FigureThreeData {
  groupA: GroupBenchmarkData;
  groupB: GroupBenchmarkData;
  xValues?: number[];
  xLabels?: Record<number, string>;
  yAxisLabel?: string;
  valueUnit?: string;
  valueLabel?: string;
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
  mode: FigureThreeMode;
  setMode: (value: FigureThreeMode | null) => Promise<URLSearchParams>;
  variable: string;
  setVariable: (value: string | null) => Promise<URLSearchParams>;
  metaIndicator: string;
  setMetaIndicator: (value: string | null) => Promise<URLSearchParams>;
  resetFigureThreeControls: () => Promise<void>;
}

export function useFigureThree() {
  const [variable, setVariable] = useQueryState(
    `${FIG_THREE_PREFIX}Var`,
    parseAsString.withDefault(DEFAULT_VARIABLE),
  );

  const [mode, setMode] = useQueryState(
    `${FIG_THREE_PREFIX}Mode`,
    parseAsString.withDefault("variable"),
  );

  const [metaIndicator, setMetaIndicator] = useQueryState(
    `${FIG_THREE_PREFIX}Meta`,
    parseAsString.withDefault(DEFAULT_META_INDICATOR),
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

  const normalizedMode: FigureThreeMode = mode === "meta" ? "meta" : "variable";
  const normalizedMetaIndicator = META_INDICATOR_VARIABLES.includes(metaIndicator)
    ? metaIndicator
    : DEFAULT_META_INDICATOR;

  const { runs, isLoading, isError } = useGetMultipleRunsForVariablePipeline({
    variable: normalizedMode === "meta" ? FIGURE_THREE_META_RUNSET_VARIABLE : variable,
    prefix: FIG_THREE_PREFIX,
    defaults: {
      startYear: 2020,
      endYear: 2050,
    },
  });

  const data = useMemo((): FigureThreeData | null => {
    if (!runs?.length) return null;

    if (normalizedMode === "meta") {
      const valueUnit = META_INDICATOR_UNITS[normalizedMetaIndicator] ?? "";
      const xLabel = META_INDICATOR_LABELS[normalizedMetaIndicator] ?? normalizedMetaIndicator;

      return {
        groupA: buildMetaIndicatorGroupData(
          runs,
          ["GW3"],
          "GW3",
          normalizedMetaIndicator,
          META_INDICATOR_BUCKET,
        ),
        groupB: buildMetaIndicatorGroupData(
          runs,
          ["GW1", "GW2"],
          "GW2+GW1",
          normalizedMetaIndicator,
          META_INDICATOR_BUCKET,
        ),
        xValues: [META_INDICATOR_BUCKET],
        xLabels: { [META_INDICATOR_BUCKET]: xLabel },
        yAxisLabel: valueUnit,
        valueUnit,
        valueLabel: "Value",
      };
    }

    return {
      groupA: buildGroupData(runs, ["GW3"], "GW3", selectedYears),
      groupB: buildGroupData(runs, ["GW1", "GW2"], "GW2+GW1", selectedYears),
      yAxisLabel: `% compared to ${getVariableBaselineYear(variable)}`,
      valueUnit: "%",
      valueLabel: "Change",
    };
  }, [runs, normalizedMode, normalizedMetaIndicator, selectedYears]);

  const resetFigureThreeControls = useCallback(async (): Promise<void> => {
    await Promise.all([
      setVariable(null),
      setMode(null),
      setMetaIndicator(null),
      setSelectedYears(null),
      setShowGroupA(null),
      setShowGroupB(null),
      setShowRangeBars(null),
      setShowNoConcernDots(null),
      setIncludeUnvetted(null),
    ]);
  }, [
    setVariable,
    setMode,
    setMetaIndicator,
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
    mode: normalizedMode,
    setMode,
    variable,
    setVariable,
    metaIndicator: normalizedMetaIndicator,
    setMetaIndicator,
    resetFigureThreeControls,
  };

  return { data, isLoading, isError, controls };
}
