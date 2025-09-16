import type { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { CATEGORY_KEYS } from "@/lib/config/reasons-of-concern/category-config";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  CLIMATE_CATEGORY_META_INDICATOR_KEY,
  YEAR_NET_ZERO_META_INDICATOR_KEY,
} from "@/lib/config/filters/climate-filter-config";
import {
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";
import { DataFrame } from "@iiasa/ixmp4-ts";

export const createMockRun = (
  metaIndicators: Array<{ key: string; value: string }> = [],
  runId = "721",
): ExtendedRun => ({
  variableName: "Emissions|Kyoto Gases",
  scenarioName: "SHAPE-SDP-MC-1.5°C",
  modelName: "REMIND-MAgPIE 3.2-4.6",
  unit: "Mt CO2-equiv/yr",
  orderedPoints: [{ year: 2040, value: 1340.3221 }],
  flagCategory: CATEGORY_KEYS.NO_FLAGS,
  metaIndicators,
  runId,
});

export const sampleRuns: ExtendedRun[] = [
  // Run 721: C1b climate, medium renewables, zero forest increase
  createMockRun(
    [
      {
        key: CLIMATE_CATEGORY_META_INDICATOR_KEY,
        value: CLIMATE_CATEGORY_FILTER_CONFIG.values[1],
      },
      { key: RENEWABLES_SHARE_2050, value: "37.48" },
      { key: FOSSIL_SHARE_2050, value: "24.33" },
      { key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY, value: "0" },
      { key: YEAR_NET_ZERO_META_INDICATOR_KEY, value: "2067" },
    ],
    "721",
  ),

  // Run 722: C1b climate, medium renewables, zero forest increase
  createMockRun(
    [
      {
        key: CLIMATE_CATEGORY_META_INDICATOR_KEY,
        value: CLIMATE_CATEGORY_FILTER_CONFIG.values[1],
      },
      { key: RENEWABLES_SHARE_2050, value: "38.03" },
      { key: FOSSIL_SHARE_2050, value: "27.23" },
      { key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY, value: "0" },
      { key: YEAR_NET_ZERO_META_INDICATOR_KEY, value: "2068" },
    ],
    "722",
  ),

  // Run 723: C7 climate, low renewables, high fossil, zero forest increase
  createMockRun(
    [
      {
        key: CLIMATE_CATEGORY_META_INDICATOR_KEY,
        value: CLIMATE_CATEGORY_FILTER_CONFIG.values[4],
      },
      { key: RENEWABLES_SHARE_2050, value: "4.79" },
      { key: FOSSIL_SHARE_2050, value: "89.24" },
      { key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY, value: "0" },
    ],
    "723",
  ),

  // Run 724: C2 climate, high renewables, high forest increase
  createMockRun(
    [
      {
        key: CLIMATE_CATEGORY_META_INDICATOR_KEY,
        value: CLIMATE_CATEGORY_FILTER_CONFIG.values[2],
      },
      { key: RENEWABLES_SHARE_2050, value: "39.95" },
      { key: FOSSIL_SHARE_2050, value: "25.82" },
      { key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY, value: "10.14" },
      { key: YEAR_NET_ZERO_META_INDICATOR_KEY, value: "2055" },
    ],
    "724",
  ),

  // Run 720: C1b climate, very high renewables, small forest increase
  createMockRun(
    [
      {
        key: CLIMATE_CATEGORY_META_INDICATOR_KEY,
        value: CLIMATE_CATEGORY_FILTER_CONFIG.values[1],
      },
      { key: RENEWABLES_SHARE_2050, value: "42.61" },
      { key: FOSSIL_SHARE_2050, value: "22.75" },
      { key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY, value: "0.08" },
      { key: YEAR_NET_ZERO_META_INDICATOR_KEY, value: "2057" },
    ],
    "720",
  ),
];

/**
 * This test data is based on actual REMIND-MAgPIE model outputs
 * showing Kyoto Gas emissions projections for different scenarios
 */
export const kyotoDataSet = new DataFrame(
  [
    [
      721,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-MC-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      1340.3221,
      "ANNUAL",
      2040,
      90634149,
    ],
    [
      721,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-MC-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      894.9178,
      "ANNUAL",
      2045,
      90634158,
    ],
    [
      721,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-MC-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      555.9932,
      "ANNUAL",
      2050,
      90634159,
    ],
    [
      722,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-RC-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      1269.4772,
      "ANNUAL",
      2040,
      90762717,
    ],
    [
      722,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-RC-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      759.8319,
      "ANNUAL",
      2045,
      90762726,
    ],
    [
      722,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-RC-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      435.3805,
      "ANNUAL",
      2050,
      90762727,
    ],
    [
      723,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SSP-NPi",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      5256.0943,
      "ANNUAL",
      2040,
      90891285,
    ],
    [
      723,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SSP-NPi",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      5484.0364,
      "ANNUAL",
      2045,
      90891294,
    ],
    [
      723,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SSP-NPi",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      5694.9615,
      "ANNUAL",
      2050,
      91215003,
    ],
    [
      724,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SSP2-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      1242.1593,
      "ANNUAL",
      2040,
      91086425,
    ],
    [
      724,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SSP2-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      698.745,
      "ANNUAL",
      2045,
      91086434,
    ],
    [
      724,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SSP2-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      414.8829,
      "ANNUAL",
      2050,
      91086435,
    ],
    [
      720,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-EI-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      1245.4107,
      "ANNUAL",
      2040,
      91214993,
    ],
    [
      720,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-EI-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      754.8085,
      "ANNUAL",
      2045,
      91215002,
    ],
    [
      720,
      "REMIND-MAgPIE 3.2-4.6",
      "SHAPE-SDP-EI-1.5°C",
      1,
      "REMIND-MAgPIE 3.2-4.6|Russia and Reforming Economies",
      "Mt CO2-equiv/yr",
      "Emissions|Kyoto Gases",
      469.8976,
      "ANNUAL",
      2050,
      91215003,
    ],
  ],
  {
    index: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    columns: [
      "run__id",
      "model",
      "scenario",
      "version",
      "region",
      "unit",
      "variable",
      "value",
      "type",
      "step_year",
      "id",
    ],
  },
);
