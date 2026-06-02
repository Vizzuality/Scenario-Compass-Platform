"use client";

import { useCallback } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { useGetMultipleRunsForVariablePipeline } from "@/hooks/runs/data-pipeline/use-get-multiple-runs-for-variable-pipeline";
import { RunPipelineReturn } from "@/types/data/run";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import {
  CAPACITY_ELECTRICITY_SOLAR,
  FIG_TWO_PREFIX,
} from "@/components/plots/plot-variations/scatter-plot/scatter-plot-config";

export interface FigureTwoDefaults {
  startYear: number;
  endYear: number;
  variable: string;
  prefix: string;
}

const DEFAULT_FIGURE_TWO_VALUES: FigureTwoDefaults = {
  startYear: 2020,
  endYear: 2040,
  variable: CAPACITY_ELECTRICITY_SOLAR,
  prefix: FIG_TWO_PREFIX,
};

export type FigureTwoVettingMode = "show" | "hide" | "grey-out";

interface UseFigureTwoReturn extends RunPipelineReturn {
  variable: string;
  setVariable: (value: string | null) => Promise<URLSearchParams>;
  startYear: string | null;
  setStartYear: (value: string) => void;
  endYear: string | null;
  setEndYear: (value: string) => void;
  geography: string | null;
  setGeography: (value: string | null) => Promise<URLSearchParams>;
  vettingMode: FigureTwoVettingMode;
  setVettingMode: (value: FigureTwoVettingMode | null) => Promise<URLSearchParams>;
  resetFigureTwoControls: () => Promise<void>;
}

export function useFigureTwo(): UseFigureTwoReturn {
  const { geography, setGeography, startYear, endYear, setStartYear, setEndYear, clearAll } =
    useBaseUrlParams({
      useDefaults: true,
      prefix: FIG_TWO_PREFIX,
      defaults: {
        startYear: DEFAULT_FIGURE_TWO_VALUES.startYear,
        endYear: DEFAULT_FIGURE_TWO_VALUES.endYear,
      },
    });

  const [variable, setVariable] = useQueryState(
    FIG_TWO_PREFIX + "Var",
    parseAsString.withDefault(DEFAULT_FIGURE_TWO_VALUES.variable),
  );

  const [vettingMode, setVettingMode] = useQueryState(
    FIG_TWO_PREFIX + "Vetting",
    parseAsString.withDefault("show"),
  );

  const pipelineData = useGetMultipleRunsForVariablePipeline({
    variable,
    prefix: FIG_TWO_PREFIX,
    defaults: {
      startYear: DEFAULT_FIGURE_TWO_VALUES.startYear,
      endYear: DEFAULT_FIGURE_TWO_VALUES.endYear,
    },
  });

  const resetFigureTwoControls = useCallback(async (): Promise<void> => {
    await Promise.all([
      setVariable(DEFAULT_FIGURE_TWO_VALUES.variable),
      setVettingMode(null),
      clearAll(),
    ]);
  }, [setVariable, setVettingMode, clearAll, DEFAULT_FIGURE_TWO_VALUES.variable]);

  const normalizedVettingMode: FigureTwoVettingMode =
    vettingMode === "hide" || vettingMode === "grey-out" ? vettingMode : "show";

  return {
    ...pipelineData,
    variable,
    setVariable,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    geography,
    setGeography,
    vettingMode: normalizedVettingMode,
    setVettingMode,
    resetFigureTwoControls,
  };
}
