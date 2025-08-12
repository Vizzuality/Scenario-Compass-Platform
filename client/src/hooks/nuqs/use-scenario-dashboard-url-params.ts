import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useMemo } from "react";
import {
  SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS,
  scenarioDashboardMainFilterSchema,
  YEAR_OPTIONS,
} from "@/containers/scenario-dashboard/utils/url-store";
import { geographyOptions } from "@/lib/constants";

export function useScenarioDashboardUrlParams() {
  const [filters, setFilters] = useQueryStates({
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR]: parseAsInteger,
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.START_YEAR]: parseAsInteger.withDefault(
      YEAR_OPTIONS[3],
    ),
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.END_YEAR]: parseAsInteger.withDefault(
      YEAR_OPTIONS[5],
    ),
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY]: parseAsString.withDefault(
      geographyOptions[0].value,
    ),
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.CLIMATE]: parseAsString,
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.ENERGY]: parseAsString,
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.LAND]: parseAsString,
  });

  const validation = useMemo(() => {
    const currentData = {
      year: filters.year ?? null,
      startYear: filters.startYear ?? null,
      endYear: filters.endYear ?? null,
      geography: filters.geography ?? null,
    };
    const result = scenarioDashboardMainFilterSchema.safeParse(currentData);
    return {
      isValid: result.success,
      errors: result.success ? null : result.error.flatten().fieldErrors,
    };
  }, [filters]);

  const setYear = (value: string | number | null) => {
    const numValue = typeof value === "string" ? parseInt(value) : value;
    setFilters({ year: numValue });
  };

  const setStartYear = (value: string | number | null) => {
    const numValue = typeof value === "string" ? parseInt(value) : value;
    setFilters({ startYear: numValue });
  };

  const setEndYear = (value: string | number | null) => {
    const numValue = typeof value === "string" ? parseInt(value) : value;
    setFilters({ endYear: numValue });
  };

  const setGeography = (value: string | null) => {
    setFilters({ geography: value });
  };

  const setClimate = (value: string) => {
    setFilters({
      climate: value,
    });
  };

  const setEnergy = (value: string) => {
    setFilters({
      energy: value,
    });
  };

  const setLand = (value: string) => {
    setFilters({
      land: value,
    });
  };

  const clearAll = () => {
    setFilters({
      year: null,
      startYear: null,
      endYear: null,
      geography: null,
      climate: null,
      energy: null,
      land: null,
    });
  };

  return {
    year: filters.year?.toString() ?? null,
    startYear: filters.startYear?.toString() ?? null,
    endYear: filters.endYear?.toString() ?? null,
    geography: filters.geography ?? null,
    climate: filters.climate ?? null,
    land: filters.land ?? null,
    energy: filters.energy ?? null,

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
