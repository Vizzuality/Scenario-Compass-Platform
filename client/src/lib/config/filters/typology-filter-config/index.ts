export const FOSSIL_FUEL_PHASE_DOWN_KEY = "fossilFuelPhaseDown";
export const MITIGATION_STRATEGY_KEY = "mitigationStrategy";

const FOSSIL_FUEL_PHASE_DOWN_VALUES = [
  "large_scale_fossil_fuel_phase_down",
  "minimal_fossil_fuel_phase_down",
  "revival_after_deep_fossil_fuel_phase_down",
];

const FOSSIL_FUEL_PHASE_DOWN_LABELS = [
  "Large scale fossil fuel phase down",
  "Minimal fossil fuel phase down",
  "Revival after deep fossil fuel phase down",
];

export const FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG = {
  name: "Fossil fuel phase down",
  mappings: FOSSIL_FUEL_PHASE_DOWN_VALUES.map((value, index) => ({
    value,
    label: FOSSIL_FUEL_PHASE_DOWN_LABELS[index],
  })),
};

const MITIGATION_STRATEGY_VALUES = [
  "low_overall_energy_demand",
  "high_demand_alongside_high_co2_removal",
  "focus_on_renewable_and_nuclear_energy_alongside_co2_removal",
];

const MITIGATION_STRATEGY_LABELS = [
  "Low overall energy demand",
  "High demand alongside high CO2 removal",
  "Focus on renewable and nuclear energy alongside CO2 removal",
];

export const MITIGATION_STRATEGY_FILTER_CONFIG = {
  name: "Mitigation strategies",
  mappings: MITIGATION_STRATEGY_VALUES.map((value, index) => ({
    value,
    label: MITIGATION_STRATEGY_LABELS[index],
  })),
};
