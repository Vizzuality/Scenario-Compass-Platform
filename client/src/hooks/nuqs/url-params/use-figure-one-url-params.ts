"use client";

import { useCallback, useMemo } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
  CAPACITY_ELECTRICITY_SOLAR,
  CAPACITY_ELECTRICITY_WIND,
  FIG_ONE_PREFIX,
} from "@/components/plots/plot-variations/scatter-plot/scatter-plot-config";
import { getParamName } from "@/utils/url-params-utils";
import { SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS } from "@/containers/scenario-dashboard-container/url-store";

export interface FigureOneUrlDefaults {
  year: number;
  xVariable: string;
  yVariable: string;
  geography?: string;
}

interface UseFigureOneUrlParamsOptions {
  defaultValues?: FigureOneUrlDefaults;
}

const DEFAULT_FIGURE_ONE_VALUES: FigureOneUrlDefaults = {
  year: 2030,
  xVariable: CAPACITY_ELECTRICITY_SOLAR,
  yVariable: CAPACITY_ELECTRICITY_WIND,
};

const createFigureOneParams = () => ({
  year: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR, FIG_ONE_PREFIX),
  geography: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY, FIG_ONE_PREFIX),
  xVariable: `${FIG_ONE_PREFIX}xV`,
  yVariable: `${FIG_ONE_PREFIX}yV`,
});

export function useFigureOneUrlParams({
  defaultValues = DEFAULT_FIGURE_ONE_VALUES,
}: UseFigureOneUrlParamsOptions = {}) {
  const params = useMemo(() => createFigureOneParams(), []);

  const queryConfig = useMemo(
    () => ({
      [params.year]: parseAsInteger.withDefault(defaultValues.year),

      [params.geography]:
        defaultValues.geography !== undefined
          ? parseAsString.withDefault(defaultValues.geography)
          : parseAsString,

      [params.xVariable]: parseAsString.withDefault(defaultValues.xVariable),

      [params.yVariable]: parseAsString.withDefault(defaultValues.yVariable),
    }),
    [params, defaultValues],
  );

  const [filters, setFilters] = useQueryStates(queryConfig);

  const setYear = useCallback(
    (value: string | number | null): Promise<URLSearchParams> => {
      if (value === null) {
        return setFilters({ [params.year]: null });
      }

      const nextValue = typeof value === "number" ? value : Number.parseInt(value, 10);

      return setFilters({
        [params.year]: Number.isNaN(nextValue) ? null : nextValue,
      });
    },
    [setFilters, params.year],
  );

  const setGeography = useCallback(
    (value: string | null): Promise<URLSearchParams> => {
      return setFilters({ [params.geography]: value });
    },
    [setFilters, params.geography],
  );

  const setXVariable = useCallback(
    (value: string | null): Promise<URLSearchParams> => {
      return setFilters({ [params.xVariable]: value });
    },
    [setFilters, params.xVariable],
  );

  const setYVariable = useCallback(
    (value: string | null): Promise<URLSearchParams> => {
      return setFilters({ [params.yVariable]: value });
    },
    [setFilters, params.yVariable],
  );

  const resetFigureOneUrlParams = useCallback(async (): Promise<void> => {
    await setFilters({
      [params.year]: defaultValues.year,
      [params.geography]: defaultValues.geography ?? null,
      [params.xVariable]: defaultValues.xVariable,
      [params.yVariable]: defaultValues.yVariable,
    });
  }, [setFilters, params, defaultValues]);

  return {
    params,
    filters,

    year: filters[params.year]?.toString() ?? null,
    geography: filters[params.geography] as string | null,
    xVariable: filters[params.xVariable] as string,
    yVariable: filters[params.yVariable] as string,

    setYear,
    setGeography,
    setXVariable,
    setYVariable,
    resetFigureOneUrlParams,
  };
}
