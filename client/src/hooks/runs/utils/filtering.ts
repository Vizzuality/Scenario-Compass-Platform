import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import {
  CLIMATE_CATEGORY_FILTER_CONFIG,
  YEAR_NET_ZERO_FILTER_CONFIG,
  YEAR_NET_ZERO_META_INDICATOR_KEY,
} from "@/lib/config/filters/climate-filter-config";

interface FilterRunsByMetaIndicatorsParams {
  runs: ExtendedRun[];
  climate: string[] | null;
  energy: string[] | null;
  land: string[] | null;
}

function matchesClimateFilter(run: ExtendedRun, climate: string[] | null): boolean {
  if (!climate || climate.length < 2) return true;
  if (!run.metaIndicators?.length) return false;

  const [key, value] = climate;

  if (key === CLIMATE_CATEGORY_FILTER_CONFIG.name) {
    return run.metaIndicators.some((mp) => mp.value === value);
  }
  if (key === YEAR_NET_ZERO_FILTER_CONFIG.name) {
    return run.metaIndicators.some(
      (mp) => mp.key === YEAR_NET_ZERO_META_INDICATOR_KEY && mp.value === value,
    );
  }

  return run.metaIndicators.some((mp) => mp.key === key && mp.value === value);
}

function matchesEnergyFilter(run: ExtendedRun, energy: string[] | null): boolean {
  if (!energy || energy.length < 2) return true;
  if (!run.metaIndicators?.length) return false;

  const [key, value] = energy;
  const [min, max] = value.split("-").map(Number);

  if (isNaN(min) || isNaN(max)) return false;

  return run.metaIndicators.some((mp) => {
    if (mp.key !== key) return false;

    const metaValue = Number(mp.value);
    if (isNaN(metaValue)) return false;

    return metaValue >= min && metaValue <= max;
  });
}

export function filterRunsByMetaIndicators({
  runs,
  climate,
  energy,
  land,
}: FilterRunsByMetaIndicatorsParams): ExtendedRun[] {
  if (!runs?.length) return [];

  return runs.filter((run) => {
    return (
      matchesClimateFilter(run, climate) &&
      matchesEnergyFilter(run, energy) &&
      matchesClimateFilter(run, land)
    );
  });
}
