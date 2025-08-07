import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useMemo, useCallback } from "react";
import {
  SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS,
  YEAR_OPTIONS,
} from "@/containers/scenario-dashboard/utils/url-store";
import { geographyOptions } from "@/lib/constants";

/**
 * Base interface for scenario dashboard URL parameter names.
 * This represents the structure without any prefix.
 */
export interface ScenarioDashboardURLParams {
  readonly year: string;
  readonly startYear: string;
  readonly endYear: string;
  readonly geography: string;
  readonly climate: string;
  readonly energy: string;
  readonly land: string;
}

/**
 * Type for prefixed parameter names (left/right comparison).
 * Generates types like "leftClimate", "rightEnergy", etc.
 */
export type ScenarioDashboardURLParamsWithPrefix = {
  [K in keyof ScenarioDashboardURLParams as
    | `left${Capitalize<K>}`
    | `right${Capitalize<K>}`]: string;
};

/**
 * Union type of all possible parameter keys (base + prefixed).
 */
export type ScenarioDashboardURLParamsKey =
  | keyof ScenarioDashboardURLParams
  | keyof ScenarioDashboardURLParamsWithPrefix;

/**
 * Type for filter values returned by the hooks.
 */
export interface ScenarioFilterValues {
  readonly year: string | null;
  readonly startYear: string | null;
  readonly endYear: string | null;
  readonly geography: string | null;
  readonly climate: string | null;
  readonly energy: string | null;
  readonly land: string | null;
}

/**
 * Type for filter setters - functions that update individual filters.
 */
export interface ScenarioFilterSetters {
  readonly setYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setStartYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setEndYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setGeography: (value: string | null) => Promise<URLSearchParams>;
  readonly setClimate: (value: string | null) => Promise<URLSearchParams>;
  readonly setEnergy: (value: string | null) => Promise<URLSearchParams>;
  readonly setLand: (value: string | null) => Promise<URLSearchParams>;
}

/**
 * Type for clear operations.
 */
export interface ScenarioClearOperations {
  readonly clearAll: () => Promise<URLSearchParams>;
  readonly clearYearFilters: () => Promise<URLSearchParams>;
  readonly clearScenarioFilters: () => Promise<URLSearchParams>;
}

/**
 * Type for helper functions.
 */
export interface ScenarioHelpers {
  readonly getActiveScenarioParams: () => ScenarioDashboardURLParamsKey[];
}

/**
 * Type for the core URL state hook return value.
 */
export interface ScenarioUrlState {
  readonly params: ScenarioDashboardURLParams;
  readonly filters: Record<string, string | number | null>;
  readonly setFilters: (
    updates: Record<string, string | number | null>,
  ) => Promise<URLSearchParams>;
}

/**
 * Generates parameter names with optional prefix
 *
 * @param baseParam - The base parameter name
 * @param prefix - Optional prefix to add
 * @returns The prefixed parameter name
 *
 * @example
 * getParamName("year", "main") // "mainYear"
 * getParamName("year", "") // "year"
 */
export const getParamName = (baseParam: string, prefix: string): string => {
  if (!prefix) return baseParam;
  return `${prefix}${baseParam.charAt(0).toUpperCase() + baseParam.slice(1)}`;
};

/**
 * Type-safe function to create parameter names.
 * Ensures the return type matches the expected interface.
 */
const createTypedParams = (prefix: string): ScenarioDashboardURLParams => ({
  year: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR, prefix),
  startYear: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.START_YEAR, prefix),
  endYear: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.END_YEAR, prefix),
  geography: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY, prefix),
  climate: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.CLIMATE, prefix),
  energy: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.ENERGY, prefix),
  land: getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.LAND, prefix),
});

/**
 * Core micro-hook: Manages URL state and parameter names
 * This is the foundation that other hooks build upon
 *
 * @param prefix - Optional prefix to namespace parameters
 * @returns URL state management and parameter names
 *
 * @example
 * const { params, filters, setFilters } = useScenarioUrlState("left");
 * setFilters({ [params.climate]: "rcp45" });
 */
export function useScenarioUrlState(prefix: string = ""): ScenarioUrlState {
  /**
   * Generates parameter names based on the provided prefix.
   * Now fully type-safe with proper return type.
   */
  const params = useMemo((): ScenarioDashboardURLParams => createTypedParams(prefix), [prefix]);

  const queryConfig = useMemo(
    () => ({
      [params.year]: parseAsInteger,
      [params.startYear]: parseAsInteger.withDefault(YEAR_OPTIONS[3]),
      [params.endYear]: parseAsInteger.withDefault(YEAR_OPTIONS[5]),
      [params.geography]: parseAsString.withDefault(geographyOptions[0].value),
      [params.climate]: parseAsString,
      [params.energy]: parseAsString,
      [params.land]: parseAsString,
    }),
    [params],
  );

  const [filters, setFilters] = useQueryStates(queryConfig);

  return { params, filters, setFilters };
}

/**
 * Micro-hook: Provides typed filter values
 * Converts raw URL values to properly typed values
 *
 * @param prefix - Optional prefix to namespace parameters
 * @returns Typed filter values (strings/null)
 *
 * @example
 * const { climate, energy, land } = useScenarioValues("left");
 * if (climate) console.log(`Climate is set to: ${climate}`);
 */
export function useScenarioValues(prefix: string = ""): ScenarioFilterValues {
  const { params, filters } = useScenarioUrlState(prefix);

  return useMemo(
    (): ScenarioFilterValues => ({
      year: filters[params.year]?.toString() ?? null,
      startYear: filters[params.startYear]?.toString() ?? null,
      endYear: filters[params.endYear]?.toString() ?? null,
      geography: filters[params.geography] as string | null,
      climate: filters[params.climate] as string | null,
      energy: filters[params.energy] as string | null,
      land: filters[params.land] as string | null,
    }),
    [filters, params],
  );
}

/**
 * Micro-hook: Provides clear/reset operations
 * Functions to clear all filters or specific filter groups
 *
 * @param prefix - Optional prefix to namespace parameters
 * @returns Clear operation functions that return promises
 *
 * @example
 * const { clearAll, clearScenarioFilters } = useScenarioClearOperations("left");
 * await clearScenarioFilters();
 */
export function useScenarioClearOperations(prefix: string = ""): ScenarioClearOperations {
  const { setFilters, params } = useScenarioUrlState(prefix);

  const clearAll = useCallback((): Promise<URLSearchParams> => {
    return setFilters({
      [params.year]: null,
      [params.startYear]: YEAR_OPTIONS[3],
      [params.endYear]: YEAR_OPTIONS[5],
      [params.geography]: geographyOptions[0].value,
      [params.climate]: null,
      [params.energy]: null,
      [params.land]: null,
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
      [params.climate]: null,
      [params.energy]: null,
      [params.land]: null,
    });
  }, [setFilters, params]);

  return { clearAll, clearYearFilters, clearScenarioFilters };
}

/**
 * Micro-hook: Provides individual setter functions
 * Type-safe setters for each filter parameter
 *
 * @param prefix - Optional prefix to namespace parameters
 * @returns Individual setter functions that return promises
 *
 * @example
 * const { setClimate, setEnergy, setYear } = useScenarioSetters("left");
 * await setClimate("rcp45");
 * await setYear(2024);
 */
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

  return useMemo(
    (): ScenarioFilterSetters => ({
      setYear: createNumberSetter(params.year),
      setStartYear: createNumberSetter(params.startYear),
      setEndYear: createNumberSetter(params.endYear),
      setGeography: createStringSetter(params.geography),
      setClimate: createStringSetter(params.climate),
      setEnergy: createStringSetter(params.energy),
      setLand: createStringSetter(params.land),
    }),
    [createNumberSetter, createStringSetter, params],
  );
}

/**
 * Micro-hook: Provides helper functions
 * Utility functions for common operations
 *
 * @param prefix - Optional prefix to namespace parameters
 * @returns Helper functions
 *
 * @example
 * const { getActiveScenarioParams } = useScenarioHelpers("left");
 * const activeParams = getActiveScenarioParams(); // ["leftClimate", "leftEnergy"]
 */
export function useScenarioHelpers(prefix: string = ""): ScenarioHelpers {
  const { filters, params } = useScenarioUrlState(prefix);

  const getActiveScenarioParams = useCallback((): ScenarioDashboardURLParamsKey[] => {
    const activeParams: ScenarioDashboardURLParamsKey[] = [];
    if (filters[params.climate] !== null)
      activeParams.push(params.climate as ScenarioDashboardURLParamsKey);
    if (filters[params.energy] !== null)
      activeParams.push(params.energy as ScenarioDashboardURLParamsKey);
    if (filters[params.land] !== null)
      activeParams.push(params.land as ScenarioDashboardURLParamsKey);
    return activeParams;
  }, [filters, params]);

  return { getActiveScenarioParams };
}

/**
 * Complete hook: Everything included (equivalent to original hook)
 * Use when you need all functionality - this is your original hook!
 *
 * @param prefix - Optional prefix to namespace parameters
 * @returns All available functionality
 *
 * @example
 * // This is the same as your original useScenarioDashboardUrlParams
 * const everything = useScenarioDashboardUrlParams("left");
 */
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
