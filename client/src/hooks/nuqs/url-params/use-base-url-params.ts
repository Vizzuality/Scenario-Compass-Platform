import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useMemo, useCallback } from "react";
import {
  SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS,
  YEAR_OPTIONS,
} from "@/containers/scenario-dashboard-container/url-store";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { BaseSetters, BaseURLParams, BaseValues } from "@/types/url-params/base-url-params-types";
import { ScenarioClearOperations } from "@/types/url-params/common";
import { getParamName } from "@/utils/url-params-utils";

const createTypedParams = (prefix: string): BaseURLParams => ({
  year: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR, prefix),
  startYear: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.START_YEAR, prefix),
  endYear: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.END_YEAR, prefix),
  geography: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY, prefix),
  model: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.MODEL, prefix),
  scenario: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.SCENARIO, prefix),
});

interface UseScenarioUrlStateParams {
  prefix?: string;
  useDefaults?: boolean;
}

export function useScenarioUrlState({
  prefix = "",
  useDefaults = true,
}: UseScenarioUrlStateParams = {}) {
  const params = useMemo((): BaseURLParams => createTypedParams(prefix), [prefix]);

  const queryConfig = useMemo(
    () => ({
      [params.year]: parseAsInteger,
      [params.startYear]: useDefaults
        ? parseAsInteger.withDefault(YEAR_OPTIONS[1])
        : parseAsInteger,
      [params.endYear]: useDefaults
        ? parseAsInteger.withDefault(YEAR_OPTIONS[YEAR_OPTIONS.length - 1])
        : parseAsInteger,
      [params.geography]: useDefaults
        ? parseAsString.withDefault(geographyConfig[0].id)
        : parseAsString,
      [params.scenario]: parseAsString,
      [params.model]: parseAsString,
    }),
    [params, useDefaults],
  );

  const [filters, setFilters] = useQueryStates(queryConfig);

  return { params, filters, setFilters };
}

export function useScenarioValues({
  prefix = "",
  useDefaults = true,
}: UseScenarioUrlStateParams = {}): BaseValues {
  const { params, filters } = useScenarioUrlState({ prefix, useDefaults });

  return useMemo(
    (): BaseValues => ({
      year: filters[params.year]?.toString() ?? null,
      startYear: filters[params.startYear]?.toString() ?? null,
      endYear: filters[params.endYear]?.toString() ?? null,
      geography: filters[params.geography] as string | null,
      scenario: filters[params.scenario] as string | null,
      model: filters[params.model] as string | null,
    }),
    [filters, params],
  );
}

export function useScenarioClearOperations({
  prefix = "",
  useDefaults = true,
}: UseScenarioUrlStateParams = {}): ScenarioClearOperations {
  const { setFilters, params } = useScenarioUrlState({ prefix, useDefaults });

  const clearAll = useCallback((): Promise<URLSearchParams> => {
    return setFilters({
      [params.year]: null,
      [params.startYear]: useDefaults ? YEAR_OPTIONS[1] : null,
      [params.endYear]: useDefaults ? YEAR_OPTIONS[YEAR_OPTIONS.length - 1] : null,
      [params.geography]: useDefaults ? geographyConfig[0].id : null,
      [params.model]: null,
      [params.scenario]: null,
    });
  }, [setFilters, params, useDefaults]);

  return { clearAll };
}

export function useScenarioSetters({
  prefix = "",
  useDefaults = true,
}: UseScenarioUrlStateParams = {}): BaseSetters {
  const { setFilters, params } = useScenarioUrlState({ prefix, useDefaults });

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
      setScenario: createStringSetter(params.scenario),
      setModel: createStringSetter(params.model),
    }),
    [createNumberSetter, createStringSetter, params],
  );
}

export function useBaseUrlParams({
  prefix = "",
  useDefaults = true,
}: UseScenarioUrlStateParams = {}) {
  const state = useScenarioUrlState({ prefix, useDefaults });
  const values = useScenarioValues({ prefix, useDefaults });
  const operations = useScenarioClearOperations({ prefix, useDefaults });
  const setters = useScenarioSetters({ prefix, useDefaults });

  return {
    ...state,
    ...values,
    ...operations,
    ...setters,
  };
}
