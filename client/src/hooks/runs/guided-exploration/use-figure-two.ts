"use client";

import { useCallback } from "react";
import { useQueryState, parseAsString, parseAsBoolean } from "nuqs";
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

interface UseFigureTwoOptions {
  defaultValues?: FigureTwoDefaults;
}

const DEFAULT_FIGURE_TWO_VALUES: FigureTwoDefaults = {
  startYear: 2020,
  endYear: 2040,
  variable: CAPACITY_ELECTRICITY_SOLAR,
  prefix: FIG_TWO_PREFIX,
};

interface UseFigureTwoReturn extends RunPipelineReturn {
  variable: string;
  setVariable: (value: string | null) => Promise<URLSearchParams>;
  startYear: string | null;
  setStartYear: (value: string) => void;
  endYear: string | null;
  setEndYear: (value: string) => void;
  geography: string | null;
  setGeography: (value: string | null) => Promise<URLSearchParams>;
  includeUnvetted: boolean;
  setIncludeUnvetted: (value: boolean | null) => Promise<URLSearchParams>;
  resetFigureTwoControls: () => Promise<void>;
}

export function useFigureTwo({
  defaultValues = DEFAULT_FIGURE_TWO_VALUES,
}: UseFigureTwoOptions = {}): UseFigureTwoReturn {
  const { geography, setGeography, startYear, endYear, setStartYear, setEndYear, clearAll } =
    useBaseUrlParams({
      useDefaults: true,
      prefix: FIG_TWO_PREFIX,
      defaults: {
        startYear: defaultValues.startYear,
        endYear: defaultValues.endYear,
      },
    });

  const [variable, setVariable] = useQueryState(
    FIG_TWO_PREFIX + "Var",
    parseAsString.withDefault(defaultValues.variable),
  );

  const [includeUnvetted, setIncludeUnvetted] = useQueryState(
    FIG_TWO_PREFIX + "Unvetted",
    parseAsBoolean.withDefault(true),
  );

  const resetFigureTwoControls = useCallback(async (): Promise<void> => {
    await Promise.all([setVariable(defaultValues.variable), clearAll()]);
  }, [setVariable, clearAll, defaultValues.variable]);

  const pipelineData = useGetMultipleRunsForVariablePipeline({
    variable,
    prefix: FIG_TWO_PREFIX,
    defaults: {
      startYear: defaultValues.startYear,
      endYear: defaultValues.endYear,
    },
  });

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
    includeUnvetted,
    setIncludeUnvetted,
    resetFigureTwoControls,
  };
}
