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
    legendVariables: [
      "Industry",
      "Residential and Commercial",
      "Transportation",
      "Carbon Management",
    ],
    variablesMap: {
      "Final Energy|Industry": "Industry",
      "Final Energy|Residential and Commercial": "Residential and Commercial",
      "Final Energy|Transportation": "Transportation",
      "Final Energy|Carbon Management": "Carbon Management",
    },
  },
  {
    title: "GHG Emissions",
    variables: ["Emissions|Kyoto Gases", "Emissions|CO2", "Emissions|CH4", "Emissions|N2O"],
    legendVariables: ["Kyoto Gases", "CO2", "CH4", "N2O"],
    variablesMap: {
      "Emissions|Kyoto Gases": "Kyoto Gases",
      "Emissions|CO2": "CO2",
      "Emissions|CH4": "CH4",
      "Emissions|N2O": "N2O",
    },
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
    legendVariables: [
      "AFOLU",
      "Industry",
      "Residential and Commercial",
      "Transport",
      "Energy Supply",
    ],
    variablesMap: {
      "Emissions|CO2|AFOLU": "AFOLU",
      "Emissions|CO2|Energy|Demand|Industry": "Industry",
      "Emissions|CO2|Energy|Demand|Residential and Commercial": "Residential and Commercial",
      "Emissions|CO2|Energy|Demand|Transport": "Transport",
      "Emissions|CO2|Energy|Supply": "Energy Supply",
    },
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
    legendVariables: ["Biomass", "Coal", "Oil", "Gas", "Nuclear", "Solar", "Wind", "Hydro"],
    variablesMap: {
      "Primary Energy|Biomass": "Biomass",
      "Primary Energy|Coal": "Coal",
      "Primary Energy|Oil": "Oil",
      "Primary Energy|Gas": "Gas",
      "Primary Energy|Nuclear": "Nuclear",
      "Primary Energy|Solar": "Solar",
      "Primary Energy|Wind": "Wind",
      "Primary Energy|Hydro": "Hydro",
    },
  },
];
