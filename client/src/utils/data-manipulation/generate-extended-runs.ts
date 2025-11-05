import { ExtendedRun } from "@/types/data/run";
import { DataPoint } from "@/types/data/data-point";
import { MetaIndicator } from "@/types/data/meta-indicator";
import computeCumulativeEmissionsRemoved from "@/utils/filtering/compute-cumulative-emissions-removed";
import { getRunCategory } from "@/utils/flags-utils/flags-utils";
import {
  createEnergyShareMetaIndicators,
  createForestAreaMetaIndicator,
  createShortDataPoints,
  createShortMetaIndicators,
} from "@/utils/data-manipulation/create-helpers";
import { EnergyShareMap } from "@/hooks/runs/filtering/use-compute-energy-share";

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
      computeCumulativeEmissionsRemoved(runMetaIndicators),
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
