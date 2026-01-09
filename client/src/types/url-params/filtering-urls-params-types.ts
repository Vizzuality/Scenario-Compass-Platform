import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";
import {
  CARBON_REMOVAL_KEY,
  END_OF_CENTURY_WARMING_KEY,
  PEAK_WARMING_KEY,
} from "@/lib/config/filters/advanced-filters-config";

export const FILTERS_CONFIG = {
  climateCategory: { group: "climate", type: "array" },
  yearNetZero: { group: "climate", type: "array" },
  [RENEWABLES_SHARE_2050]: { group: "energy", type: "string" },
  [FOSSIL_SHARE_2050]: { group: "energy", type: "string" },
  [BIOMASS_SHARE_2050]: { group: "energy", type: "string" },
  [INCREASE_IN_GLOBAL_FOREST_AREA_KEY]: { group: "land", type: "string" },
  [CARBON_REMOVAL_KEY]: { group: "advanced", type: "string" },
  [PEAK_WARMING_KEY]: { group: "advanced", type: "string" },
  [END_OF_CENTURY_WARMING_KEY]: { group: "advanced", type: "string" },
} as const;

export type FilterKey = keyof typeof FILTERS_CONFIG;

export type FilterValues = {
  [K in FilterKey]: (typeof FILTERS_CONFIG)[K]["type"] extends "array"
    ? string[] | null
    : string | null;
};

export type FilterSetters = {
  [K in FilterKey as `set${Capitalize<K>}`]: (
    value: (typeof FILTERS_CONFIG)[K]["type"] extends "array" ? string[] | null : string | null,
  ) => Promise<URLSearchParams>;
};
