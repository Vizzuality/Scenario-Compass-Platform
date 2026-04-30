import { useMemo } from "react";
import { ExtendedRun } from "@/types/data/run";
import { ThresholdBand } from "@/lib/config/guided-exploration/capacity-thresholds";
import { getConcernLevel } from "@/lib/config/guided-exploration/threshold-colors";
import { IS_PART_OF_AR_6 } from "@/lib/config/reasons-of-concern/category-config";

export const useConcernSummary = (
  runs: ExtendedRun[] | undefined,
  thresholds: ThresholdBand,
  year: number,
  includeUnvetted: boolean = true,
) => {
  return useMemo(() => {
    if (!runs?.length) return { high: 0, medium: 0, none: 0, unvetted: 0 };

    let high = 0,
      medium = 0,
      none = 0,
      unvetted = 0;

    for (const run of runs) {
      const isVetted = includeUnvetted
        ? true
        : run.metaIndicators.some((mi) => mi.key === IS_PART_OF_AR_6 && mi.value === "true");

      if (!isVetted) {
        unvetted++;
        continue;
      }

      const point = run.orderedPoints.find((p) => p.year === year);
      if (!point) continue;

      const level = getConcernLevel(point.value, thresholds);
      if (level === "high") high++;
      else if (level === "medium") medium++;
      else none++;
    }

    return { high, medium, none, unvetted };
  }, [runs, thresholds, year, includeUnvetted]);
};
