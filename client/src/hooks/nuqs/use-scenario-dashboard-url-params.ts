import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useMemo } from "react";
import {
  SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS,
  scenarioDashboardMainFilterSchema,
  YEAR_OPTIONS,
} from "@/containers/scenario-dashboard/utils/url-store";
import { geographyOptions } from "@/lib/constants";

/**
 * Hook for managing scenario dashboard URL parameters with optional prefix support.
 * Supports multiple independent filter sets via prefix parameter.
 *
 * @param prefix - Optional prefix to namespace this filter set in the URL
 *                 Use different prefixes for multiple dashboard instances on the same page
 *
 * @example Single filter set (default)
 * const filters = useScenarioDashboardUrlParams();
 * URL: ?year=2024&geography=global
 *
 * @example Multiple filter sets on same page
 * const mainFilters = useScenarioDashboardUrlParams("main");
 * const comparisonFilters = useScenarioDashboardUrlParams("comparison");
 * URL: ?mainYear=2024&mainGeography=global&comparisonYear=2025
 *
 * @example Named filter sets for different views
 * const scenarioFilters = useScenarioDashboardUrlParams("scenario");
 * const baselineFilters = useScenarioDashboardUrlParams("baseline");
 * URL: ?scenarioYear=2024&baselineYear=2023
 */
export function useScenarioDashboardUrlParams(prefix: string = "") {
  const getParamName = (baseParam: string) => {
    return prefix
      ? `${prefix}${baseParam.charAt(0).toUpperCase() + baseParam.slice(1)}`
      : baseParam;
  };

  const queryConfig = {
    [getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR)]: parseAsInteger,
    [getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.START_YEAR)]:
      parseAsInteger.withDefault(YEAR_OPTIONS[3]),
    [getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.END_YEAR)]:
      parseAsInteger.withDefault(YEAR_OPTIONS[5]),
    [getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY)]:
      parseAsString.withDefault(geographyOptions[0].value),
    [getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.CLIMATE)]: parseAsString,
    [getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.ENERGY)]: parseAsString,
    [getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.LAND)]: parseAsString,
  } as const;

  const [filters, setFilters] = useQueryStates(queryConfig);

  const yearParam = getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR);
  const startYearParam = getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.START_YEAR);
  const endYearParam = getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.END_YEAR);
  const geographyParam = getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY);
  const climateParam = getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.CLIMATE);
  const energyParam = getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.ENERGY);
  const landParam = getParamName(SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.LAND);

  const validation = useMemo(() => {
    const currentData = {
      year: filters[yearParam] ?? null,
      startYear: filters[startYearParam] ?? null,
      endYear: filters[endYearParam] ?? null,
      geography: filters[geographyParam] ?? null,
    };
    const result = scenarioDashboardMainFilterSchema.safeParse(currentData);
    return {
      isValid: result.success,
      errors: result.success ? null : result.error.flatten().fieldErrors,
    };
  }, [filters, yearParam, startYearParam, endYearParam, geographyParam]);

  const setYear = (value: string | number | null) => {
    const numValue = typeof value === "string" ? parseInt(value) : value;
    setFilters({ [yearParam]: numValue });
  };

  const setStartYear = (value: string | number | null) => {
    const numValue = typeof value === "string" ? parseInt(value) : value;
    setFilters({ [startYearParam]: numValue });
  };

  const setEndYear = (value: string | number | null) => {
    const numValue = typeof value === "string" ? parseInt(value) : value;
    setFilters({ [endYearParam]: numValue });
  };

  const setGeography = (value: string | null) => {
    setFilters({ [geographyParam]: value });
  };

  const setClimate = (value: string) => {
    setFilters({
      [climateParam]: value,
    });
  };

  const setEnergy = (value: string) => {
    setFilters({
      [energyParam]: value,
    });
  };

  const setLand = (value: string) => {
    setFilters({
      [landParam]: value,
    });
  };

  const clearAll = () => {
    setFilters({
      [yearParam]: null,
      [startYearParam]: null,
      [endYearParam]: null,
      [geographyParam]: null,
      [climateParam]: null,
      [energyParam]: null,
      [landParam]: null,
    });
  };

  return {
    year: filters[yearParam]?.toString() ?? null,
    startYear: filters[startYearParam]?.toString() ?? null,
    endYear: filters[endYearParam]?.toString() ?? null,
    geography: filters[geographyParam] as string | null,
    climate: filters[climateParam] as string | null,
    land: filters[landParam] as string | null,
    energy: filters[energyParam] as string | null,

    setClimate,
    setLand,
    setEnergy,
    setYear,
    setStartYear,
    setEndYear,
    setGeography,

    clearAll,
    isValid: validation.isValid,
    errors: validation.errors,
  };
}
