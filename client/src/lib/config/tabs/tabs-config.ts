import {
  EXPLORATION_CLIMATE_TAB_PLOT_CONFIG,
  EXPLORATION_ENERGY_TAB_PLOT_CONFIG,
  EXPLORATION_GENERAL_TAB_PLOT_CONFIG,
  EXPLORATION_LAND_USE_TAB_PLOT_CONFIG,
  PlotConfig,
  SingleScenarioPlotConfig,
} from "@/lib/config/tabs/variables-config";

export type DefaultTabTitles = "land use" | "energy" | "general" | "climate";

export const NUMBER_OF_PLOTS_PER_TAB = 4;

export type TabConfig =
  | {
      tabTitle: DefaultTabTitles;
      explorationPlotConfigArray: ReadonlyArray<PlotConfig>;
      isCustom: false;
    }
  | {
      tabTitle: string;
      isCustom: true;
    };

export const TABS_CONFIG_ARRAY: ReadonlyArray<TabConfig> = [
  {
    tabTitle: "general",
    explorationPlotConfigArray: EXPLORATION_GENERAL_TAB_PLOT_CONFIG,
    isCustom: false,
  },
  {
    tabTitle: "energy",
    explorationPlotConfigArray: EXPLORATION_ENERGY_TAB_PLOT_CONFIG,
    isCustom: false,
  },
  {
    tabTitle: "land use",
    explorationPlotConfigArray: EXPLORATION_LAND_USE_TAB_PLOT_CONFIG,
    isCustom: false,
  },
  {
    tabTitle: "climate",
    explorationPlotConfigArray: EXPLORATION_CLIMATE_TAB_PLOT_CONFIG,
    isCustom: false,
  },
  {
    tabTitle: "custom",
    isCustom: true,
  },
] as const;

export const SINGLE_SCENARIO_VIEW_PLOTS_CONFIG_ARRAY: ReadonlyArray<SingleScenarioPlotConfig> = [
  {
    title: "Total Final Energy",
    variables: [
      "Final Energy|Industry",
      "Final Energy|Residential and Commercial",
      "Final Energy|Transportation",
      "Final Energy|Carbon Management",
    ],
    parent: "Final Energy|",
  },
  {
    title: "GHG Emissions",
    variables: ["Emissions|Kyoto Gases", "Emissions|CO2", "Emissions|CH4", "Emissions|N2O"],
    parent: "Emissions|",
  },
  {
    title: "CO2 emissions reductions by sector",
    variables: [
      "Emissions|CO2|AFOLU",
      "Emissions|CO2|Energy|Demand|Industry",
      "Emissions|CO2|Energy|Demand|Residential and Commercial",
      "Emissions|CO2|Energy|Demand|Transport",
      "Emissions|CO2|Energy|Supply",
    ],
    parent: "Emissions|CO2|",
  },
  {
    title: "Primary Energy Production",
    variables: [
      "Primary Energy|Biomass",
      "Primary Energy|Coal",
      "Primary Energy|Oil",
      "Primary Energy|Gas",
      "Primary Energy|Nuclear",
      "Primary Energy|Solar",
      "Primary Energy|Wind",
      "Primary Energy|Hydro",
    ],
    parent: "Primary Energy|",
  },
];
