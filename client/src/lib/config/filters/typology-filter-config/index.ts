export const FOSSIL_FUEL_PHASE_DOWN_KEY = "fossilFuelPhaseDown";
export const MITIGATION_STRATEGY_KEY = "mitigationStrategy";

export const SCENARIO_TYPOLOGY_META_KEY = "Scenario Typology|SCI 2025 [beta]";

export const FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG = {
  name: "Fossil fuel phase down",
  mappings: [
    {
      value: "gradual_ff_po",
      label: "Gradual Fossil-Fuel Phase-Out",
    },
    {
      value: "rapid_ff_po",
      label: "Rapid Fossil-Fuel Phase-Out",
    },
  ],
} as const;

export const MITIGATION_STRATEGY_FILTER_CONFIG = {
  name: "Mitigation strategies",
  mappings: [
    {
      value: "ccs",
      label: "Carbon Capture and Storage",
    },
    {
      value: "cdr",
      label: "Carbon Dioxide Removal",
    },
    {
      value: "ld",
      label: "Low Demand",
    },
    {
      value: "ldd",
      label: "Low Demand and Decarbonization",
    },
  ],
} as const;
