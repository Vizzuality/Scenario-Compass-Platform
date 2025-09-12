import { getRunCategory } from "@/containers/scenario-dashboard/utils/flags-utils";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { DataPoint } from "@/components/plots/types";
import { ExtendedRun, ShortDataPoint, ShortMetaIndicator } from "@/hooks/runs/pipeline/types";
import { EnergyShareMap } from "@/hooks/runs/filtering/use-compute-energy-share";
import {
  BIOMASS_SHARE_2050,
  FOSSIL_SHARE_2050,
  RENEWABLES_SHARE_2050,
} from "@/lib/config/filters/energy-filter-config";
import { INCREASE_IN_GLOBAL_FOREST_AREA_KEY } from "@/lib/config/filters/land-filter-config";

interface Params {
  metaIndicators: MetaIndicator[];
  dataPoints: DataPoint[];
  energyShares: EnergyShareMap | null;
  gfaIncreaseArray: Record<string, number>;
}

export const generateExtendedRuns = ({
  metaIndicators,
  dataPoints,
  energyShares,
  gfaIncreaseArray,
}: Params): ExtendedRun[] => {
  if (!metaIndicators.length || !dataPoints.length || !energyShares) {
    return [];
  }

  const dataPointsByRunId = new Map<string, DataPoint[]>();
  for (const dataPoint of dataPoints) {
    const runId = String(dataPoint.runId);
    const existingPoints = dataPointsByRunId.get(runId);

    if (existingPoints) {
      existingPoints.push(dataPoint);
    } else {
      dataPointsByRunId.set(runId, [dataPoint]);
    }
  }

  const metaIndicatorsByRunId = new Map<string, MetaIndicator[]>();
  for (const metaIndicator of metaIndicators) {
    const runId = String(metaIndicator.runId);
    const existingMeta = metaIndicatorsByRunId.get(runId);

    if (existingMeta) {
      existingMeta.push(metaIndicator);
    } else {
      metaIndicatorsByRunId.set(runId, [metaIndicator]);
    }
  }

  const extendedRuns: ExtendedRun[] = [];

  for (const runId of dataPointsByRunId.keys()) {
    const runMetaIndicators = metaIndicatorsByRunId.get(runId);
    const runDataPoints = dataPointsByRunId.get(runId)!;

    if (!runMetaIndicators?.length || !runDataPoints.length) {
      continue;
    }

    const metaIndicators = [
      ...createShortMetaIndicators(runMetaIndicators),
      ...createEnergyShareMetaIndicators(energyShares, runId),
      ...createForestAreaMetaIndicator(gfaIncreaseArray, runId),
    ];

    const firstDataPoint = runDataPoints[0];
    const extendedRun: ExtendedRun = {
      runId,
      variableName: firstDataPoint.variable,
      scenarioName: firstDataPoint.scenarioName,
      modelName: firstDataPoint.modelName,
      unit: firstDataPoint.unit,
      orderedPoints: createShortDataPoints(runDataPoints),
      flagCategory: getRunCategory(runMetaIndicators),
      metaIndicators,
    };

    extendedRuns.push(extendedRun);
  }

  return extendedRuns;
};

// Helper functions

function createShortDataPoints(dataPoints: DataPoint[]): ShortDataPoint[] {
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

function createShortMetaIndicators(metaIndicators: MetaIndicator[]): ShortMetaIndicator[] {
  const shortMetaIndicators: ShortMetaIndicator[] = [];

  for (const metaIndicator of metaIndicators) {
    shortMetaIndicators.push({
      key: metaIndicator.key,
      value: metaIndicator.value,
    });
  }

  return shortMetaIndicators;
}

function createEnergyShareMetaIndicators(
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

function createForestAreaMetaIndicator(
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
