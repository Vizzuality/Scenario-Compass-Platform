import { useMemo } from "react";
import {
  ExtendedRun,
  ShortDataPoint,
  ShortMetaIndicator,
} from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { Run } from "@iiasa/ixmp4-ts";
import { getRunCategory } from "@/containers/scenario-dashboard/utils/flags-utils";

interface Props {
  runs: Run[];
  metaLookup: Map<string, ShortMetaIndicator[]>;
  dataPointsLookup: Map<string, ShortDataPoint[]>;
}

const buildLookupKey = (run: Run): string => {
  if (!run.model?.name || !run.scenario?.name) {
    throw new Error("Invalid run structure: missing model or scenario name.");
  }
  return `${run.model.name}-${run.scenario.name}`;
};

export const useGenerateExtendedRuns = ({
  runs,
  metaLookup,
  dataPointsLookup,
}: Props): ExtendedRun[] => {
  return useMemo(() => {
    if (!runs?.length) return [];

    return runs.map((run): ExtendedRun => {
      const lookupKey = buildLookupKey(run);
      const metaIndicators: ShortMetaIndicator[] = metaLookup.get(lookupKey) ?? [];
      const dps: ShortDataPoint[] = dataPointsLookup.get(lookupKey) ?? [];
      const categoryKey = getRunCategory(metaIndicators);

      return {
        id: run.id,
        scenario: { name: run.scenario.name, id: run.scenario.id },
        model: { name: run.model.name, id: run.model.id },
        points: dps,
        flagCategory: categoryKey,
        metaIndicators,
      };
    });
  }, [runs, metaLookup, dataPointsLookup]);
};
