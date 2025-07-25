import { z } from "zod";
import { GEOGRAPHY_VALUES } from "@/lib/constants";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useMemo } from "react";

export const YEAR_OPTIONS = [2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];

export const SCENARIO_DASHBOARD_SEARCH_PARAMS = {
  YEAR: "year",
  START_YEAR: "startYear",
  END_YEAR: "endYear",
  GEOGRAPHY: "geography",
} as const;

const minYear = YEAR_OPTIONS[0];
const maxYear = YEAR_OPTIONS[YEAR_OPTIONS.length - 1];

export const yearFilterSchema = z
  .object({
    [SCENARIO_DASHBOARD_SEARCH_PARAMS.YEAR]: z.number().min(minYear).max(maxYear).optional(),
    [SCENARIO_DASHBOARD_SEARCH_PARAMS.START_YEAR]: z.number().min(minYear).max(maxYear).optional(),
    [SCENARIO_DASHBOARD_SEARCH_PARAMS.END_YEAR]: z.number().min(minYear).max(maxYear).optional(),
    [SCENARIO_DASHBOARD_SEARCH_PARAMS.GEOGRAPHY]: z
      .enum(GEOGRAPHY_VALUES as [string, ...string[]])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startYear && data.endYear) {
        return data.startYear <= data.endYear;
      }
      return true;
    },
    {
      message: "Start year must be less than or equal to end year",
    },
  );

export function useScenarioDashboardUrlParams() {
  const [filters, setFilters] = useQueryStates({
    [SCENARIO_DASHBOARD_SEARCH_PARAMS.YEAR]: parseAsInteger,
    [SCENARIO_DASHBOARD_SEARCH_PARAMS.START_YEAR]: parseAsInteger,
    [SCENARIO_DASHBOARD_SEARCH_PARAMS.END_YEAR]: parseAsInteger,
    [SCENARIO_DASHBOARD_SEARCH_PARAMS.GEOGRAPHY]: parseAsString,
  });

  const validation = useMemo(() => {
    const currentData = {
      year: filters.year ?? undefined,
      startYear: filters.startYear ?? undefined,
      endYear: filters.endYear ?? undefined,
      geography: filters.geography ?? undefined,
    };
    const result = yearFilterSchema.safeParse(currentData);
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

  const clearAll = () => {
    setFilters({
      year: null,
      startYear: null,
      endYear: null,
      geography: null,
    });
  };

  return {
    year: filters.year?.toString() ?? null,
    startYear: filters.startYear?.toString() ?? null,
    endYear: filters.endYear?.toString() ?? null,
    geography: filters.geography ?? null,

    setYear,
    setStartYear,
    setEndYear,
    setGeography,

    clearAll,
    isValid: validation.isValid,
    errors: validation.errors,
  };
}
