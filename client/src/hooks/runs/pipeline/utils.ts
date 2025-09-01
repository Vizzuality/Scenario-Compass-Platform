import { getRunCategory } from "@/containers/scenario-dashboard/utils/flags-utils";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { DataPoint } from "@/components/plots/types";
import { ExtendedRun, ShortDataPoint, ShortMetaIndicator } from "@/hooks/runs/pipeline/types";

export const generateExtendedRuns = ({
  metaIndicators,
  dataPoints,
}: {
  metaIndicators: MetaIndicator[];
  dataPoints: DataPoint[];
}): ExtendedRun[] => {
  if (!metaIndicators.length || !dataPoints.length) {
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

    const firstDataPoint = runDataPoints[0];
    const extendedRun: ExtendedRun = {
      runId,
      scenarioName: firstDataPoint.scenarioName,
      modelName: firstDataPoint.modelName,
      orderedPoints: createShortDataPoints(runDataPoints),
      flagCategory: getRunCategory(runMetaIndicators),
      metaIndicators: createShortMetaIndicators(runMetaIndicators),
    };

    extendedRuns.push(extendedRun);
  }

  return extendedRuns;
};

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
