const CLIMATE_CATEGORY_SHORT_NAMES = [
  "GW0",
  "GW1",
  "GW2",
  "GW3",
  "GW4",
  "GW5",
  "GW6",
  "GW7",
  "GW8",
];

const CLIMATE_CATEGORY_LONG_NAMES = [
  "Below 1.5°C with no OS",
  "Below 1.5°C with low OS",
  "Below 1.5°C with high OS",
  "Likely below 2°C",
  "Below 2°C",
  "Below 2.5°C",
  "Below 3.0°C",
  "Below 4.0°C",
  "Above 4.0°C",
];

export const CLIMATE_CATEGORY_FILTER_CONFIG = {
  name: "Climate Category",
  mappings: CLIMATE_CATEGORY_SHORT_NAMES.map((shortName, index) => ({
    value: shortName,
    label: CLIMATE_CATEGORY_LONG_NAMES[index],
  })),
};

const YEAR_NET_ZERO_VALUES = [
  "2010",
  "2020",
  "2030",
  "2040",
  "2050",
  "2060",
  "2070",
  "2080",
  "2090",
  "2100",
];

export const YEAR_NET_ZERO_FILTER_CONFIG = {
  name: "Year of global net-zero",
  mappings: YEAR_NET_ZERO_VALUES.map((year) => ({
    value: year,
    label: year,
  })),
};

export const CLIMATE_CATEGORY_META_INDICATOR_KEY = "Climate Category|SCI 2025";

export const YEAR_NET_ZERO_META_INDICATOR_KEY = "Emissions Diagnostics|Year of Net Zero|CO2";

export const CUMULATIVE_EMISSIONS_META_INDICATOR_KEY =
  "Emissions Diagnostics|Cumulative CCS [2020-2100, Gt CO2]";

export const YEAR_PEAK_TEMPERATURE_META_INDICATOR_KEY =
  "Climate Assessment|Year of Peak Warming|Median [MAGICCv7.5.3]";
