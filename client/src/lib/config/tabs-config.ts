import {
  EXPLORATION_CLIMATE_TAB_PLOT_CONFIG,
  EXPLORATION_ENERGY_TAB_PLOT_CONFIG,
  EXPLORATION_GENERAL_TAB_PLOT_CONFIG,
  EXPLORATION_LAND_USE_TAB_PLOT_CONFIG,
  PlotConfig,
} from "@/lib/config/variables-config";

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
