import { ExtendedRun } from "@/types/data/run";
import { YEAR_NET_ZERO_CO2_META_INDICATOR_KEY } from "@/lib/config/filters/climate-filter-config";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard-container/url-store";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";
import {
  CARBON_REMOVAL_KEY,
  END_OF_CENTURY_WARMING_KEY,
  PEAK_WARMING_KEY,
} from "@/lib/config/filters/advanced-filters-config";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import {
  FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG,
  FOSSIL_FUEL_PHASE_DOWN_KEY,
  MITIGATION_STRATEGY_FILTER_CONFIG,
  MITIGATION_STRATEGY_KEY,
  SCENARIO_TYPOLOGY_META_KEY,
} from "@/lib/config/filters/typology-filter-config";

interface FilterRunsByMetaIndicatorsParams {
  runs: ExtendedRun[];
  climateCategory: string[] | null;
  yearNetZero: string[] | null;
  [BIOMASS_SHARE_2050]: string | null;
  [FOSSIL_SHARE_2050]: string | null;
  [RENEWABLES_SHARE_2050]: string | null;
  [INCREASE_IN_GLOBAL_FOREST_AREA_KEY]: string | null;
  [CARBON_REMOVAL_KEY]: string | null;
  [PEAK_WARMING_KEY]: string | null;
  [END_OF_CENTURY_WARMING_KEY]: string | null;
  [FOSSIL_FUEL_PHASE_DOWN_KEY]: string[] | null;
  [MITIGATION_STRATEGY_KEY]: string[] | null;
}

export function matchesClimateCategoryFilter(
  run: ExtendedRun,
  climateCategory: string[] | null,
): boolean {
  if (!climateCategory || climateCategory.length === 0) return true;
  if (!run.metaIndicators?.length) return false;
  return climateCategory.some((categoryValue) =>
    run.metaIndicators.some((mp) => mp.value.includes(categoryValue)),
  );
}

export function matchesYearNetZeroFilter(run: ExtendedRun, yearNetZero: string[] | null): boolean {
  if (!yearNetZero || yearNetZero.length === 0) return true;
  if (!run.metaIndicators?.length) return false;

  return yearNetZero.some((year) =>
    run.metaIndicators.some(
      (mp) => mp.key === YEAR_NET_ZERO_CO2_META_INDICATOR_KEY && mp.value === year,
    ),
  );
}

export function matchesStrategy(
  run: ExtendedRun,
  params: string[] | null,
  mappings: readonly { value: string; label: string }[],
): boolean {
  if (!params || params.length === 0) return true;

  const paramsSet = new Set<string>(params);

  const filteredLabels = new Set<string>(
    mappings.filter(({ value }) => paramsSet.has(value)).map(({ label }) => label),
  );

  return run.metaIndicators.some(
    ({ key, value }) => key === SCENARIO_TYPOLOGY_META_KEY && filteredLabels.has(value),
  );
}

export function matchesSliderFilter(
  run: ExtendedRun,
  filterKey: string,
  filterValues: string | null,
): boolean {
  if (!filterValues) return true;

  if (!run.metaIndicators?.length) return false;

  const [min, max] = filterValues.split(URL_VALUES_FILTER_SEPARATOR).map(Number);

  if (isNaN(min) || isNaN(max)) return false;

  return run.metaIndicators.some((mp) => {
    if (mp.key !== filterKey) return false;

    const metaValue = Number(mp.value);
    if (isNaN(metaValue)) return false;

    return metaValue >= min && metaValue <= max;
  });
}

export function filterRunsByMetaIndicators({
  runs,
  climateCategory,
  yearNetZero,
  renewablesShare,
  gfaIncrease,
  carbonRemoval,
  biomassShare,
  fossilShare,
  peakWarming,
  eocWarming,
  fossilFuelPhaseDown,
  mitigationStrategy,
}: FilterRunsByMetaIndicatorsParams): ExtendedRun[] {
  if (!runs?.length) return [];

  return runs.filter((run) => {
    return (
      matchesClimateCategoryFilter(run, climateCategory) &&
      matchesYearNetZeroFilter(run, yearNetZero) &&
      matchesStrategy(run, fossilFuelPhaseDown, FOSSIL_FUEL_PHASE_DOWN_FILTER_CONFIG.mappings) &&
      matchesStrategy(run, mitigationStrategy, MITIGATION_STRATEGY_FILTER_CONFIG.mappings) &&
      matchesSliderFilter(run, RENEWABLES_SHARE_2050, renewablesShare) &&
      matchesSliderFilter(run, INCREASE_IN_GLOBAL_FOREST_AREA_KEY, gfaIncrease) &&
      matchesSliderFilter(run, BIOMASS_SHARE_2050, biomassShare) &&
      matchesSliderFilter(run, FOSSIL_SHARE_2050, fossilShare) &&
      matchesSliderFilter(run, CARBON_REMOVAL_KEY, carbonRemoval) &&
      matchesSliderFilter(run, PEAK_WARMING_KEY, peakWarming) &&
      matchesSliderFilter(run, END_OF_CENTURY_WARMING_KEY, eocWarming)
    );
  });
}
