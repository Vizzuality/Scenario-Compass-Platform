import { parseAsArrayOf, parseAsString, ParserBuilder, useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";
import {
  FilterKey,
  FILTERS_CONFIG,
  FilterSetters,
  FilterValues,
} from "@/types/url-params/filtering-urls-params-types";
import { getParamName } from "@/utils/url-params-utils";

/**
 * Hook to generate filter parameter names with optional prefix
 *
 * Takes each filter key and transforms it into a URL parameter name,
 * optionally applying a prefix (e.g., "scenarioClimateCategory").
 *
 * @param prefix - Optional prefix to prepend to parameter names
 * @returns Object mapping filter keys to their URL parameter names
 *
 * @example
 * Without prefix:
 * ```ts
 * const params = useFilterParams();
 * {
 *    climateCategory: "climateCategory",
 *    yearNetZero: "yearNetZero",
 *    renewablesShare2050: "renewablesShare2050",
 *  }
 * ```
 *
 * @example
 * With prefix:
 * ```ts
 * const params = useFilterParams("scenario");
 *  {
 *    climateCategory: "scenario_climateCategory",
 *    yearNetZero: "scenario_yearNetZero",
 *    renewablesShare2050: "scenario_renewablesShare2050",
 *  }
 * ```
 */
function useFilterParams(prefix: string = "") {
  return useMemo(() => {
    const paramMappings: Record<FilterKey, string> = {} as Record<FilterKey, string>;
    const filterKeys = Object.keys(FILTERS_CONFIG);
    for (const key of filterKeys) {
      const filterKey = key as FilterKey;
      paramMappings[filterKey] = getParamName(key, prefix);
    }

    return paramMappings;
  }, [prefix]);
}

/**

 * Generates nuqs parser configuration for all filter URL parameters
 *
 * This hook creates the configuration object that nuqs uses to:
 * - Parse URL query parameters into JavaScript values
 * - Serialize JavaScript values back into URL parameters
 * - Provide default values when parameters are missing
 *
 * The parser type is determined by the filter's type definition:
 * - "array" type → parseAsArrayOf(parseAsString, ',').withDefault([])
 *   URL format: ?climateCategory=C1b,C1a
 * - "string" type → parseAsString.withDefault(null)
 *   URL format: ?renewablesShare2050=10:20
 *
 * @param params - Mapping of filter keys to their URL parameter names (from useFilterParams)
 * @returns Configuration object for useQueryStates hook
 *
 * @example
 * Basic usage:
 * ```ts
 * const params = useFilterParams();
 * const config = useFilterParserConfig(params);
 * const [filters, setFilters] = useQueryStates(config);
 * ```
 *
 * @example
 * Generated config structure:
 * ```ts
 * {
 *   "climateCategory": parseAsArrayOf(parseAsString, ',').withDefault([]),  // ?climateCategory=C1b,C1a
 *   "yearNetZero": parseAsArrayOf(parseAsString, ',').withDefault([]),      // ?yearNetZero=2050,2060
 *   "renewablesShare2050": parseAsString.withDefault(null),                 // ?renewablesShare2050=10:20
 *   "fossilShare2050": parseAsString.withDefault(null),                     // ?fossilShare2050=5:15
 * }
 * ```
 */
function useFilterParserConfig(params: Record<FilterKey, string>) {
  return useMemo(() => {
    const result = {} as Record<
      string,
      ParserBuilder<string[] | string | null> | ParserBuilder<string | null>
    >;

    Object.entries(FILTERS_CONFIG).forEach(([key, config]) => {
      const paramName = params[key as FilterKey];

      if (config.type === "array") {
        result[paramName] = parseAsArrayOf(parseAsString, ",").withDefault([]) as ParserBuilder<
          string[] | string | null
        >;
      } else if (config.type === "string") {
        result[paramName] = parseAsString as ParserBuilder<string | null>;
      }
    });

    return result;
  }, [params]);
}

/**
 * Transforms URL filter state into a normalized values object
 *
 * Takes the raw filters from useQueryStates and maps them back to their
 * original filter keys, handling both array and string type filters.
 *
 * @param filters - Raw filter state from useQueryStates
 * @param params - Mapping of filter keys to URL parameter names
 * @returns Normalized object with filter keys mapped to their values
 *
 * @example
 * Input filters (from URL):
 * ```ts
 * {
 *   "climateCategory": ["C1b", "C1a"],           // array type
 *   "yearNetZero": ["2050", "2060"],             // array type
 *   "renewablesShare2050": "10:20",              // string type
 *   "fossilShare2050": null                      // not set
 * }
 * ```
 *
 * @example
 * Output values (normalized):
 * ```ts
 * {
 *   climateCategory: ["C1b", "C1a"],
 *   yearNetZero: ["2050", "2060"],
 *   renewablesShare2050: "10:20",
 *   fossilShare2050: null
 * }
 * ```
 */
function useFilterValues(
  filters: Record<string, string[] | string | null>,
  params: Record<FilterKey, string>,
) {
  return useMemo(() => {
    const result: Record<string, unknown> = {};

    Object.entries(FILTERS_CONFIG).forEach(([key, config]) => {
      const filterKey = key as FilterKey;
      const paramName = params[filterKey];
      const value = filters[paramName];

      if (config.type === "array") {
        result[filterKey] = Array.isArray(value) ? value : null;
      } else {
        result[filterKey] = typeof value === "string" ? value : null;
      }
    });

    return result as FilterValues;
  }, [filters, params]);
}

function useFilterSetters(
  params: Record<FilterKey, string>,
  setFilters: (updates: Record<string, string[] | string | null>) => Promise<URLSearchParams>,
) {
  return useMemo(() => {
    const result = {} as Record<string, (v: string[] | string | null) => Promise<URLSearchParams>>;

    Object.entries(FILTERS_CONFIG).forEach(([key, config]) => {
      const filterKey = key as FilterKey;
      const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;

      result[setterName] = (value: string[] | string | null) => {
        if (config.type === "array") {
          return setFilters({
            [params[filterKey]]: value || [],
          });
        } else if (config.type === "string") {
          return setFilters({
            [params[filterKey]]: value,
          });
        } else return setFilters({});
      };
    });

    return result as FilterSetters;
  }, [params, setFilters]);
}

function useClearAllFilters(
  params: Record<FilterKey, string>,
  setFilters: (updates: Record<string, string[] | null>) => Promise<URLSearchParams>,
) {
  return useCallback(() => {
    const reset = {} as Record<string, null>;

    Object.keys(FILTERS_CONFIG).forEach((key) => {
      reset[params[key as FilterKey]] = null;
    });

    return setFilters(reset);
  }, [params, setFilters]);
}

export function useFilterUrlParams(prefix: string = "") {
  const params = useFilterParams(prefix);
  const config = useFilterParserConfig(params);
  const [filters, setFilters] = useQueryStates(config);
  const values = useFilterValues(filters, params);
  const setters = useFilterSetters(params, setFilters);
  const clearAll = useClearAllFilters(params, setFilters);

  return {
    params,
    filters,
    setFilters,
    ...values,
    ...setters,
    clearAll,
  };
}
