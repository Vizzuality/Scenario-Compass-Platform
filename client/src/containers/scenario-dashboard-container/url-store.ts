export const YEAR_OPTIONS = [2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];
export const URL_VALUES_FILTER_SEPARATOR = ":";

export const TOP_FILTER_OPTIONS = {
  YEAR: "year",
  START_YEAR: "startYear",
  END_YEAR: "endYear",
  GEOGRAPHY: "geography",
} as const;

export const RUN_SPECIFIC_FILTERING_FIELDS = {
  MODEL: "model",
  SCENARIO: "scenario",
} as const;

export const SCENARIO_FILTER_OPTIONS = {
  CLIMATE: "climate",
  ENERGY: "energy",
  LAND: "land",
  ADVANCED: "advanced",
} as const;

export const SCENARIO_DASHBOARD_MAIN_FILTER_SEARCH_PARAMS = {
  ...TOP_FILTER_OPTIONS,
  ...SCENARIO_FILTER_OPTIONS,
  ...RUN_SPECIFIC_FILTERING_FIELDS,
} as const;
