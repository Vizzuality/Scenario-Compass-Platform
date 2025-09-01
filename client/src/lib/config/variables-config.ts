export type PlotConfig = {
  title: string;
  variables: ReadonlyArray<string>;
};

// Exploration View Plot Configurations

export const EXPLORATION_GENERAL_TAB_PLOT_CONFIG: ReadonlyArray<PlotConfig> = [
  {
    title: "Fossil-Fuel Use",
    variables: ["Primary Energy|Fossil"],
  },
  {
    title: "Electrification",
    variables: ["Final Energy|Electricity"],
  },
  {
    title: "Carbon Dioxide Removal",
    variables: ["Carbon Removal"],
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
    title: "Renewable Scale-Up",
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
    title: "Sectoral Emission Reductions",
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
    title: "Land Cover Changes",
    variables: [
      "Land Cover|Built-Up Area",
      "Land Cover|Cropland",
      "Land Cover|Forest",
      "Land Cover|Other Land",
      "Land Cover|Pasture",
    ],
  },
  {
    title: "Land-based CDR Potential",
    variables: [
      "Carbon Removal|Land Use|Re/Afforestation",
      "Carbon Capture|Energy|Biomass",
      "Land Cover|Cropland|Energy Crops",
    ],
  },
];

export const EXPLORATION_CLIMATE_TAB_PLOT_CONFIG: ReadonlyArray<PlotConfig> = [
  {
    title: "Emissions",
    variables: ["Emissions|Kyoto", "Emissions|CO2", "Emissions|CH4", "Emissions|N20"],
  },
];

// Single Run View Plot Configurations @TODO: customize these
