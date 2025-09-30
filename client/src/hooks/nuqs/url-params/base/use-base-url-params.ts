import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useMemo, useCallback } from "react";
import {
  SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS,
  YEAR_OPTIONS,
} from "@/containers/scenario-dashboard/utils/url-store";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { BaseSetters, BaseURLParams, BaseValues } from "@/hooks/nuqs/url-params/base/types";
import { getParamName, ScenarioClearOperations } from "@/hooks/nuqs/url-params/common";

const createTypedParams = (prefix: string): BaseURLParams => ({
  year: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR, prefix),
  startYear: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.START_YEAR, prefix),
  endYear: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.END_YEAR, prefix),
  geography: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY, prefix),
});

export function useScenarioUrlState(prefix: string = "") {
  const params = useMemo((): BaseURLParams => createTypedParams(prefix), [prefix]);

  const queryConfig = useMemo(
    () => ({
      [params.year]: parseAsInteger,
      [params.startYear]: parseAsInteger.withDefault(YEAR_OPTIONS[1]),
      [params.endYear]: parseAsInteger.withDefault(YEAR_OPTIONS[YEAR_OPTIONS.length - 1]),
      [params.geography]: parseAsString.withDefault(geographyConfig[0].value),
    }),
    [params],
  );

  const [filters, setFilters] = useQueryStates(queryConfig);

  return { params, filters, setFilters };
}

export function useScenarioValues(prefix: string = ""): BaseValues {
  const { params, filters } = useScenarioUrlState(prefix);

  return useMemo(
    (): BaseValues => ({
      year: filters[params.year]?.toString() ?? null,
      startYear: filters[params.startYear]?.toString() ?? null,
      endYear: filters[params.endYear]?.toString() ?? null,
      geography: filters[params.geography] as string | null,
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
    });
  }, [setFilters, params]);

  return { clearAll };
}

export function useScenarioSetters(prefix: string = ""): BaseSetters {
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

  return useMemo(
    (): BaseSetters => ({
      setYear: createNumberSetter(params.year),
      setStartYear: createNumberSetter(params.startYear),
      setEndYear: createNumberSetter(params.endYear),
      setGeography: createStringSetter(params.geography),
    }),
    [createNumberSetter, createStringSetter, params],
  );
}

export function useBaseUrlParams(prefix: string = "") {
  const state = useScenarioUrlState(prefix);
  const values = useScenarioValues(prefix);
  const operations = useScenarioClearOperations(prefix);
  const setters = useScenarioSetters(prefix);

  return {
    ...state,
    ...values,
    ...operations,
    ...setters,
  };
}
