import { MetaIndicator } from "@/types/data/meta-indicator";
import { DataPoint } from "@/types/data/data-point";
import { ShortDataPoint, ShortMetaIndicator } from "@/types/data/run";
import { EnergyShareMap } from "@/hooks/runs/filtering/use-compute-energy-share";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";

export function createShortDataPoints(dataPoints: DataPoint[]): ShortDataPoint[] {
  const shortPoints: ShortDataPoint[] = [];

  for (const dataPoint of dataPoints) {
    shortPoints.push({
      year: dataPoint.year,
      value: dataPoint.value,
    });
  }

  shortPoints.sort((a, b) => a.year - b.year);

  return shortPoints;
}

export function createShortMetaIndicators(metaIndicators: MetaIndicator[]): ShortMetaIndicator[] {
  const shortMetaIndicators: ShortMetaIndicator[] = [];

  for (const metaIndicator of metaIndicators) {
    shortMetaIndicators.push({
      key: metaIndicator.key,
      value: metaIndicator.value,
    });
  }

  return shortMetaIndicators;
}

export function createEnergyShareMetaIndicators(
  energyShares: EnergyShareMap | null | undefined,
  runId: string,
): ShortMetaIndicator[] {
  if (!energyShares || !energyShares[runId]) {
    return [];
  }

  const energyShare = energyShares[runId];

  return [
    { key: RENEWABLES_SHARE_2050, value: energyShare[RENEWABLES_SHARE_2050].toString() },
    { key: FOSSIL_SHARE_2050, value: energyShare[FOSSIL_SHARE_2050].toString() },
    { key: BIOMASS_SHARE_2050, value: energyShare[BIOMASS_SHARE_2050].toString() },
  ];
}

export function createForestAreaMetaIndicator(
  forestAreaIncreases: Record<string, number> | null | undefined,
  runId: string,
): ShortMetaIndicator[] {
  if (!forestAreaIncreases || forestAreaIncreases[runId] === undefined) {
    return [];
  }

  return [
    {
      key: INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
      value: forestAreaIncreases[runId].toString(),
    },
  ];
}
