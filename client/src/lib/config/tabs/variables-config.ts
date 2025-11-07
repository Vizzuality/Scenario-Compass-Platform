import { ChartType, PLOT_TYPE_OPTIONS } from "@/components/plots/components";

export const YEAR_OF_PEAK_WARMING = "Climate Assessment|Year of Peak Warming|Median [MAGICCv7.5.3]";

export type PlotConfig = {
  title: string;
  variables: ReadonlyArray<string>;
  plotType?: ChartType;
};

export type SingleScenarioPlotConfig = PlotConfig & {
  legendVariables: string[];
  variablesMap: Record<string, string>;
};

export const EXPLORATION_GENERAL_TAB_PLOT_CONFIG: ReadonlyArray<PlotConfig> = [
  {
    title: "Fossil-fuel use",
    variables: ["Primary Energy|Fossil"],
  },
  {
    title: "Electrification",
    variables: ["Final Energy|Electricity"],
  },
  {
    title: "Carbon Capture Sequestration",
    variables: ["Carbon Capture|Geological Storage"],
  },
  {
    title: "Emissions",
    variables: ["Emissions|Kyoto Gases"],
  },
];

export const EXPLORATION_ENERGY_TAB_PLOT_CONFIG: ReadonlyArray<PlotConfig> = [
  {
    title: "Decarbonization",
    variables: ["Primary Energy|Fossil", "Primary Energy|Gas"],
  },
  {
    title: "Renewable scale-up",
    variables: [
      "Secondary Energy|Electricity",
      "Secondary Energy|Electricity|Biomass",
      "Secondary Energy|Electricity|Biomass|w/ CCS",
      "Secondary Energy|Electricity|Biomass|w/o CCS",
      "Secondary Energy|Electricity|Coal",
      "Secondary Energy|Electricity|Gas",
      "Secondary Energy|Electricity|Geothermal",
    ],
  },
  {
    title: "Sectoral emission reductions",
    variables: [
      "Emissions|CO2|Energy|Demand|Industry",
      "Emissions|CO2|Energy|Demand|Residential and Commercial",
      "Emissions|CO2|Energy|Demand|ITransport",
      "Emissions|CO2|Energy|Supply",
    ],
  },
];

export const EXPLORATION_LAND_USE_TAB_PLOT_CONFIG: ReadonlyArray<PlotConfig> = [
  {
    title: "Land cover changes",
    variables: [
      "Land Cover|Built-Up Area",
      "Land Cover|Cropland",
      "Land Cover|Forest",
      "Land Cover|Other Land",
      "Land Cover|Pasture",
    ],
  },
  {
    title: "Land-based CDR potential",
    variables: [
      "Carbon Removal|Land Use|Re/Afforestation",
      "Carbon Capture|Energy|Biomass",
      "Land Cover|Cropland|Energy Crops",
    ],
  },
  {
    title: "Energy crops",
    variables: ["Land Cover|Cropland|Energy Crops", "Agricultural Production|Non-Energy|Crops"],
  },
];

export const EXPLORATION_CLIMATE_TAB_PLOT_CONFIG: ReadonlyArray<PlotConfig> = [
  {
    title: "Emissions",
    variables: ["Emissions|Kyoto Gases", "Emissions|CO2", "Emissions|CH4", "Emissions|N20"],
  },
  {
    title: "Climate system",
    variables: ["Climate Assessment|Surface Temperature (GSAT)|Median [MAGICCv7.5.3]"],
  },
  {
    title: "Peak emissions and warming",
    variables: ["Climate Assessment|Peak Warming|Median [MAGICCv7.5.3]", YEAR_OF_PEAK_WARMING],
    plotType: PLOT_TYPE_OPTIONS.HISTOGRAM,
  },
  {
    title: "Negative emissions",
    variables: ["Carbon Capture|Geological Storage"],
  },
];
