import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { YEAR_NET_ZERO_META_INDICATOR_KEY } from "@/lib/config/filters/climate-filter-config";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard/utils/url-store";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";
import { CARBON_REMOVAL_KEY } from "@/lib/config/filters/advanced-filters-config";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";

interface FilterRunsByMetaIndicatorsParams {
  runs: ExtendedRun[];
  climateCategory: string[] | null;
  yearNetZero: string[] | null;
  [BIOMASS_SHARE_2050]: string | null;
  [FOSSIL_SHARE_2050]: string | null;
  [RENEWABLES_SHARE_2050]: string | null;
  [INCREASE_IN_GLOBAL_FOREST_AREA_KEY]: string | null;
  [CARBON_REMOVAL_KEY]: string | null;
}

export function matchesClimateCategoryFilter(
  run: ExtendedRun,
  climateCategory: string[] | null,
): boolean {
  if (!climateCategory || climateCategory.length === 0) return true;
  if (!run.metaIndicators?.length) return false;
  console.log(run.metaIndicators);
  return climateCategory.some((categoryValue) =>
    run.metaIndicators.some((mp) => mp.value.includes(categoryValue)),
  );
}

export function matchesYearNetZeroFilter(run: ExtendedRun, yearNetZero: string[] | null): boolean {
  if (!yearNetZero || yearNetZero.length === 0) return true;
  if (!run.metaIndicators?.length) return false;

  return yearNetZero.some((year) =>
    run.metaIndicators.some(
      (mp) => mp.key === YEAR_NET_ZERO_META_INDICATOR_KEY && mp.value === year,
    ),
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
}: FilterRunsByMetaIndicatorsParams): ExtendedRun[] {
  if (!runs?.length) return [];

  return runs.filter((run) => {
    return (
      matchesClimateCategoryFilter(run, climateCategory) &&
      matchesYearNetZeroFilter(run, yearNetZero) &&
      matchesSliderFilter(run, RENEWABLES_SHARE_2050, renewablesShare) &&
      matchesSliderFilter(run, INCREASE_IN_GLOBAL_FOREST_AREA_KEY, gfaIncrease) &&
      matchesSliderFilter(run, BIOMASS_SHARE_2050, biomassShare) &&
      matchesSliderFilter(run, FOSSIL_SHARE_2050, fossilShare) &&
      matchesSliderFilter(run, CARBON_REMOVAL_KEY, carbonRemoval)
    );
  });
}
