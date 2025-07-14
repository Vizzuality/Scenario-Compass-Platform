import {
  EMISSIONS_VARIABLES_OPTIONS,
  ENERGY_VARIABLES_OPTIONS,
  GENERAL_VARIABLES_OPTIONS,
  LAND_USE_VARIABLES_OPTIONS,
} from "@/lib/constants/variables-options";

export const tabsArray = [
  {
    name: "general",
    variables: GENERAL_VARIABLES_OPTIONS,
  },
  {
    name: "energy",
    variables: ENERGY_VARIABLES_OPTIONS,
  },
  {
    name: "land use",
    variables: LAND_USE_VARIABLES_OPTIONS,
  },
  {
    name: "emissions/climate",
    variables: EMISSIONS_VARIABLES_OPTIONS,
  },
] as const;

export type TabItem = "land use" | "energy" | "general" | "emissions/climate";
