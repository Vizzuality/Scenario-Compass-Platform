export interface EnergyType {
  key: EnergyKey;
  label: string;
}

export const FOSSIL_SHARE_2050 = "fossilShare";
export const RENEWABLES_SHARE_2050 = "renewablesShare";
export const BIOMASS_SHARE_2050 = "biomassShare";

export type EnergyKey =
  | typeof FOSSIL_SHARE_2050
  | typeof RENEWABLES_SHARE_2050
  | typeof BIOMASS_SHARE_2050;

export const energyTypes: EnergyType[] = [
  { key: FOSSIL_SHARE_2050, label: "Share of fossil fuel in primary energy in 2050" },
  { key: RENEWABLES_SHARE_2050, label: "Share of renewables in primary energy in 2050" },
  { key: BIOMASS_SHARE_2050, label: "Share of biomass in 2050" },
];

export const PRIMARY_ENERGY_VARIABLE = "Primary Energy";
export const PRIMARY_ENERGY_FOSSIL_VARIABLE = "Primary Energy|Fossil";
export const PRIMARY_ENERGY_RENEWABLES_VARIABLE = "Primary Energy|Non-Biomass Renewables";
export const PRIMARY_ENERGY_BIOMASS_VARIABLE = "Primary Energy|Biomass";

export const PRIMARY_ENERGY_VARIABLES = [
  PRIMARY_ENERGY_VARIABLE,
  PRIMARY_ENERGY_FOSSIL_VARIABLE,
  PRIMARY_ENERGY_RENEWABLES_VARIABLE,
  PRIMARY_ENERGY_BIOMASS_VARIABLE,
];
