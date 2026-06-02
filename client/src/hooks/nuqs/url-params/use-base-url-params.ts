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

interface DefaultValues {
  startYear?: number;
  endYear?: number;
  geography?: string;
}

interface UseScenarioUrlStateParams {
  prefix?: string;
  useDefaults?: boolean;
  defaults?: DefaultValues;
}

export function useScenarioUrlState({
  prefix = "",
  useDefaults = true,
  defaults = {},
}: UseScenarioUrlStateParams = {}) {
  const {
    startYear = YEAR_OPTIONS[1],
    endYear = YEAR_OPTIONS[YEAR_OPTIONS.length - 1],
    geography = geographyConfig[0].id,
  } = defaults;

  const params = useMemo((): BaseURLParams => createTypedParams(prefix), [prefix]);

  const queryConfig = useMemo(
    () => ({
      [params.year]: parseAsInteger,
      [params.startYear]: useDefaults ? parseAsInteger.withDefault(startYear) : parseAsInteger,
      [params.endYear]: useDefaults ? parseAsInteger.withDefault(endYear) : parseAsInteger,
      [params.geography]: useDefaults ? parseAsString.withDefault(geography) : parseAsString,
      [params.scenario]: parseAsString,
      [params.model]: parseAsString,
    }),
    [params, useDefaults, startYear, endYear, geography],
  );

  const [filters, setFilters] = useQueryStates(queryConfig);

  return { params, filters, setFilters };
}

export function useScenarioValues({
  prefix = "",
  useDefaults = true,
  defaults = {},
}: UseScenarioUrlStateParams = {}): BaseValues {
  const { params, filters } = useScenarioUrlState({ prefix, useDefaults, defaults });

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
  defaults = {},
}: UseScenarioUrlStateParams = {}): ScenarioClearOperations {
  const { setFilters, params } = useScenarioUrlState({ prefix, useDefaults, defaults });

  const {
    startYear = YEAR_OPTIONS[1],
    endYear = YEAR_OPTIONS[YEAR_OPTIONS.length - 1],
    geography = geographyConfig[0].id,
  } = defaults;

  const clearAll = useCallback((): Promise<URLSearchParams> => {
    return setFilters({
      [params.year]: null,
      [params.startYear]: useDefaults ? startYear : null,
      [params.endYear]: useDefaults ? endYear : null,
      [params.geography]: useDefaults ? geography : null,
      [params.model]: null,
      [params.scenario]: null,
    });
  }, [setFilters, params, useDefaults, startYear, endYear, geography]);

  return { clearAll };
}

export function useScenarioSetters({
  prefix = "",
  useDefaults = true,
  defaults = {},
}: UseScenarioUrlStateParams = {}): BaseSetters {
  const { setFilters, params } = useScenarioUrlState({ prefix, useDefaults, defaults });

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
  defaults = {},
}: UseScenarioUrlStateParams = {}) {
  const state = useScenarioUrlState({ prefix, useDefaults, defaults });
  const values = useScenarioValues({ prefix, useDefaults, defaults });
  const operations = useScenarioClearOperations({ prefix, useDefaults, defaults });
  const setters = useScenarioSetters({ prefix, useDefaults, defaults });

  return {
    ...state,
    ...values,
    ...operations,
    ...setters,
  };
}
