import { z } from "zod";
import { GEOGRAPHY_VALUES } from "@/lib/config/filters/geography-filter-config";

export const YEAR_OPTIONS = [2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];
export const URL_VALUES_FILTER_SEPARATOR = ":";

export const UNSET_FILTER_VALUE = "unset";

export const TOP_FILTER_OPTIONS = {
  YEAR: "year",
  START_YEAR: "startYear",
  END_YEAR: "endYear",
  GEOGRAPHY: "geography",
} as const;

export const SCENARIO_FILTER_OPTIONS = {
  CLIMATE: "climate",
  ENERGY: "energy",
  LAND: "land",
} as const;

export const SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS = {
  ...TOP_FILTER_OPTIONS,
  ...SCENARIO_FILTER_OPTIONS,
} as const;

const minYear = YEAR_OPTIONS[0];
const maxYear = YEAR_OPTIONS[YEAR_OPTIONS.length - 1];

export const scenarioDashboardMainFilterSchema = z
  .object({
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.YEAR]: z
      .number()
      .min(minYear)
      .max(maxYear)
      .optional(),
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.START_YEAR]: z
      .number()
      .min(minYear)
      .max(maxYear)
      .optional(),
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.END_YEAR]: z
      .number()
      .min(minYear)
      .max(maxYear)
      .optional(),
    [SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS.GEOGRAPHY]: z
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
