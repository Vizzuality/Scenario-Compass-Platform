"use client";

import { useQueryStates, parseAsInteger, parseAsString, parseAsArrayOf } from "nuqs";
import { useMemo, useCallback } from "react";
import {
  SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS,
  YEAR_OPTIONS,
} from "@/containers/scenario-dashboard/utils/url-store";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import {
  ScenarioClearOperations,
  ScenarioDashboardURLParams,
  ScenarioDashboardURLParamsKey,
  ScenarioFilterSetters,
  ScenarioFilterValues,
  ScenarioHelpers,
  ScenarioUrlState,
} from "@/hooks/nuqs/types";

export const getParamName = (baseParam: string, prefix: string): string => {
  if (!prefix) return baseParam;
  return `${prefix}${baseParam.charAt(0).toUpperCase() + baseParam.slice(1)}`;
};

const createTypedParams = (prefix: string): ScenarioDashboardURLParams => ({
  year: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR, prefix),
  startYear: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.START_YEAR, prefix),
  endYear: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.END_YEAR, prefix),
  geography: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY, prefix),
  climate: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.CLIMATE, prefix),
  energy: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.ENERGY, prefix),
  land: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.LAND, prefix),
  advanced: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.ADVANCED, prefix),
});

export function useScenarioUrlState(prefix: string = ""): ScenarioUrlState {
  const params = useMemo((): ScenarioDashboardURLParams => createTypedParams(prefix), [prefix]);

  const queryConfig = useMemo(
    () => ({
      [params.year]: parseAsInteger,
      [params.startYear]: parseAsInteger.withDefault(YEAR_OPTIONS[1]),
      [params.endYear]: parseAsInteger.withDefault(YEAR_OPTIONS[YEAR_OPTIONS.length - 1]),
      [params.geography]: parseAsString.withDefault(geographyConfig[0].value),
      [params.climate]: parseAsArrayOf(parseAsString).withDefault([]),
      [params.energy]: parseAsArrayOf(parseAsString).withDefault([]),
      [params.land]: parseAsArrayOf(parseAsString).withDefault([]),
      [params.advanced]: parseAsArrayOf(parseAsString).withDefault([]),
    }),
    [params],
  );

  const [filters, setFilters] = useQueryStates(queryConfig);

  return { params, filters, setFilters };
}

export function useScenarioValues(prefix: string = ""): ScenarioFilterValues {
  const { params, filters } = useScenarioUrlState(prefix);

  return useMemo(
    (): ScenarioFilterValues => ({
      year: filters[params.year]?.toString() ?? null,
      startYear: filters[params.startYear]?.toString() ?? null,
      endYear: filters[params.endYear]?.toString() ?? null,
      geography: filters[params.geography] as string | null,
      climate: filters[params.climate] as string[] | null,
      energy: filters[params.energy] as string[] | null,
      land: filters[params.land] as string[] | null,
      advanced: filters[params.advanced] as string[] | null,
    }),
    [filters, params],
  );
}

export function useScenarioClearOperations(prefix: string = ""): ScenarioClearOperations {
  const { setFilters, params } = useScenarioUrlState(prefix);

  const clearAll = useCallback((): Promise<URLSearchParams> => {
    return setFilters({
      [params.year]: null,
      [params.startYear]: YEAR_OPTIONS[1],
      [params.endYear]: YEAR_OPTIONS[YEAR_OPTIONS.length - 1],
      [params.geography]: geographyConfig[0].value,
      [params.climate]: [],
      [params.energy]: [],
      [params.land]: [],
      [params.advanced]: [],
    });
  }, [setFilters, params]);

  const clearYearFilters = useCallback((): Promise<URLSearchParams> => {
    return setFilters({
      [params.year]: null,
      [params.startYear]: YEAR_OPTIONS[3],
      [params.endYear]: YEAR_OPTIONS[5],
    });
  }, [setFilters, params]);

  const clearScenarioFilters = useCallback((): Promise<URLSearchParams> => {
    return setFilters({
      [params.climate]: [],
      [params.energy]: [],
      [params.land]: [],
      [params.advanced]: [],
    });
  }, [setFilters, params]);

  return { clearAll, clearYearFilters, clearScenarioFilters };
}

export function useScenarioSetters(prefix: string = ""): ScenarioFilterSetters {
  const { setFilters, params } = useScenarioUrlState(prefix);

  const parseNumber = useCallback((value: string | number | null): number | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return isNaN(value) ? null : value;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }, []);

  const createNumberSetter = useCallback(
    (paramName: string) =>
      (value: string | number | null): Promise<URLSearchParams> => {
        const numValue = parseNumber(value);
        return setFilters({ [paramName]: numValue });
      },
    [setFilters, parseNumber],
  );

  const createStringSetter = useCallback(
    (paramName: string) =>
      (value: string | null): Promise<URLSearchParams> => {
        return setFilters({ [paramName]: value });
      },
    [setFilters],
  );

  const createArraySetter = useCallback(
    (paramName: string) =>
      (value: string[] | null): Promise<URLSearchParams> => {
        return setFilters({ [paramName]: value || [] });
      },
    [setFilters],
  );

  return useMemo(
    (): ScenarioFilterSetters => ({
      setYear: createNumberSetter(params.year),
      setStartYear: createNumberSetter(params.startYear),
      setEndYear: createNumberSetter(params.endYear),
      setGeography: createStringSetter(params.geography),
      setClimate: createArraySetter(params.climate),
      setEnergy: createArraySetter(params.energy),
      setLand: createArraySetter(params.land),
      setAdvanced: createArraySetter(params.advanced),
    }),
    [createNumberSetter, createStringSetter, createArraySetter, params],
  );
}

export function useScenarioHelpers(prefix: string = ""): ScenarioHelpers {
  const { params } = useScenarioUrlState(prefix);
  const { filters } = useScenarioUrlState(prefix);

  const getActiveScenarioParams = useCallback((): ScenarioDashboardURLParamsKey[] => {
    const activeParams: ScenarioDashboardURLParamsKey[] = [];

    const hasValidValue = (value: string | number | string[] | null) => {
      return value !== null && value !== undefined && Array.isArray(value) && value.length > 0;
    };

    if (hasValidValue(filters[params.climate])) {
      activeParams.push(params.climate as ScenarioDashboardURLParamsKey);
    }
    if (hasValidValue(filters[params.energy])) {
      activeParams.push(params.energy as ScenarioDashboardURLParamsKey);
    }
    if (hasValidValue(filters[params.land])) {
      activeParams.push(params.land as ScenarioDashboardURLParamsKey);
    }
    if (hasValidValue(filters[params.advanced])) {
      activeParams.push(params.advanced as ScenarioDashboardURLParamsKey);
    }

    return activeParams;
  }, [filters, params.advanced, params.climate, params.energy, params.land]);

  return { getActiveScenarioParams };
}

export function useScenarioDashboardUrlParams(prefix: string = "") {
  const state = useScenarioUrlState(prefix);
  const values = useScenarioValues(prefix);
  const operations = useScenarioClearOperations(prefix);
  const setters = useScenarioSetters(prefix);
  const helpers = useScenarioHelpers(prefix);

  return {
    ...state,
    ...values,
    ...operations,
    ...setters,
    ...helpers,
  };
}
