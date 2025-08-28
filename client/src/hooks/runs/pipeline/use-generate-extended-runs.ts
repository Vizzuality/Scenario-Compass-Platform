import { useMemo } from "react";
import { getRunCategory } from "@/containers/scenario-dashboard/utils/flags-utils";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { DataPoint } from "@/components/plots/types";
import { ExtendedRun, ShortDataPoint, ShortMetaIndicator } from "@/hooks/runs/pipeline/types";

export const useGenerateExtendedRuns = ({
  metaIndicators,
  dataPoints,
}: {
  metaIndicators: MetaIndicator[];
  dataPoints: DataPoint[];
}): ExtendedRun[] => {
  return useMemo(() => {
    if (!metaIndicators.length || !dataPoints.length) {
      return [];
    }

    // Single pass to create both lookups and collect keys
    const dataPointsLookup = new Map<string, DataPoint[]>();
    const dataKeysSet = new Set<string>();

    dataPoints.forEach((dp) => {
      const key = String(dp.runId);
      dataKeysSet.add(key);
      const existing = dataPointsLookup.get(key);
      if (existing) {
        existing.push(dp);
      } else {
        dataPointsLookup.set(key, [dp]);
      }
    });

    const metaIndicatorsLookup = new Map<string, MetaIndicator[]>();
    const metaKeysSet = new Set<string>();

    metaIndicators.forEach((meta) => {
      const key = String(meta.runId);
      metaKeysSet.add(key);
      const existing = metaIndicatorsLookup.get(key);
      if (existing) {
        existing.push(meta);
      } else {
        metaIndicatorsLookup.set(key, [meta]);
      }
    });

    // Efficient set comparison
    if (
      dataKeysSet.size !== metaKeysSet.size ||
      !Array.from(dataKeysSet).every((key) => metaKeysSet.has(key))
    ) {
      const onlyInDataPoints = Array.from(dataKeysSet).filter((key) => !metaKeysSet.has(key));
      const onlyInMeta = Array.from(metaKeysSet).filter((key) => !dataKeysSet.has(key));

      throw new Error(
        `Key mismatch detected:\nOnly in dataPoints: ${onlyInDataPoints}\nOnly in metaIndicators: ${onlyInMeta}`,
      );
    }

    // Process only data keys since sets are identical
    return Array.from(dataKeysSet).reduce<ExtendedRun[]>((acc, runId) => {
      const metaIndicators = metaIndicatorsLookup.get(runId)!;
      const points = dataPointsLookup.get(runId)!;

      if (!metaIndicators.length || !points.length) {
        return acc;
      }

      const firstPoint = points[0];
      acc.push({
        runId,
        scenarioName: firstPoint.scenarioName,
        modelName: firstPoint.modelName,
        points: points
          .map((dp): ShortDataPoint => ({ year: dp.year, value: dp.value }))
          .sort((a, b) => a.year - b.year),
        flagCategory: getRunCategory(metaIndicators),
        metaIndicators: metaIndicators.map(
          (meta): ShortMetaIndicator => ({ key: meta.key, value: meta.value }),
        ),
      });

      return acc;
    }, []);
  }, [dataPoints, metaIndicators]);
};
