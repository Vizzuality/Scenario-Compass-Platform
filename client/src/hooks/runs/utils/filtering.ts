import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { CLIMATE_CATEGORY_FILTER_CONFIG } from "@/lib/config/filters/climate-filter-config";

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

  return run.metaIndicators.some((mp) => mp.key === key && mp.value === value);
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
      matchesClimateFilter(run, energy) &&
      matchesClimateFilter(run, land)
    );
  });
}
