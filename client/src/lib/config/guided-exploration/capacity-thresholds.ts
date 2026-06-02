import {
  CAPACITY_ELECTRICITY_HYDRO,
  CAPACITY_ELECTRICITY_NUCLEAR,
  CAPACITY_ELECTRICITY_SOLAR,
  CAPACITY_ELECTRICITY_WIND,
  CAPACITY_ELECTRICITY_WIND_OFFSHORE,
  CARBON_CAPTURE,
} from "@/components/plots/plot-variations/scatter-plot/scatter-plot-config";

export interface ThresholdBand {
  name: string;
  year?: number;
  high: { upper?: number; lower?: number };
  medium: { upper?: number; lower?: number };
}

export const FLAG_THRESHOLDS: Record<string, ThresholdBand[]> = {
  [CAPACITY_ELECTRICITY_SOLAR]: [
    {
      name: "Feasibility Concern|Solar PV Capacity|World|2030",
      year: 2030,
      high: { upper: 10896.0, lower: 2683.2 },
      medium: { upper: 8163.7, lower: 4350.2 },
    },
  ],
  [CAPACITY_ELECTRICITY_WIND]: [
    {
      name: "Feasibility Concern|Wind Capacity|World|2030",
      year: 2030,
      high: { lower: 1220.0 },
      medium: { lower: 1719.0 },
    },
  ],
  [CAPACITY_ELECTRICITY_WIND_OFFSHORE]: [
    {
      name: "Feasibility Concern|Onshore Wind Capacity|World|2030",
      year: 2030,
      high: { upper: 3655.0, lower: 1220.0 },
      medium: { upper: 2853.0, lower: 1719.0 },
    },
  ],
  [CAPACITY_ELECTRICITY_HYDRO]: [
    {
      name: "Feasibility Concern|Hydropower Capacity|World|2030",
      year: 2030,
      high: { upper: 2117.58, lower: 979.43 },
      medium: { upper: 1606.66, lower: 1175.37 },
    },
  ],
  [CAPACITY_ELECTRICITY_NUCLEAR]: [
    {
      name: "Feasibility Concern|Nuclear Capacity|World|2030",
      year: 2030,
      high: { upper: 507.1 },
      medium: { upper: 441.92, lower: 320.33 },
    },
  ],
  [CARBON_CAPTURE]: [
    {
      name: "Feasibility Concern|Carbon Capture|World|2030",
      year: 2030,
      high: { upper: 457.89 },
      medium: { upper: 152.47, lower: 44.02 },
    },
    {
      name: "Feasibility Concern|Carbon Capture|World|2035",
      year: 2035,
      high: {},
      medium: { upper: 1300 },
    },
    {
      name: "Feasibility Concern|Carbon Capture|World|2040",
      year: 2040,
      high: {},
      medium: { upper: 4300 },
    },
  ],
  "Carbon Capture|Geological Storage": [
    {
      name: "Feasibility Concern|Carbon Capture|World|2030",
      year: 2030,
      high: { upper: 457.89 },
      medium: { upper: 152.47, lower: 44.02 },
    },
    {
      name: "Feasibility Concern|Carbon Capture|World|2035",
      year: 2035,
      high: {},
      medium: { upper: 1300 },
    },
    {
      name: "Feasibility Concern|Carbon Capture|World|2040",
      year: 2040,
      high: {},
      medium: { upper: 4300 },
    },
  ],
  "Primary Energy|Biomass": [
    {
      name: "Sustainability Concern|Unsustainable Bioenergy Use|World",
      high: { upper: 245 },
      medium: { upper: 100 },
    },
  ],
  "Food Availability [per capita]": [
    {
      name: "Sustainability Concern|Food Availability|World",
      high: {},
      medium: { upper: 5000, lower: 2100 },
    },
  ],
};
