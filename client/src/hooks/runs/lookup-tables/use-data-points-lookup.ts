import { useGroupLookup } from "@/hooks/runs/lookup-tables/use-group-lookup";
import { ShortDataPoint } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";
import { DataPoint } from "@/components/plots/types/plots";

export function useDataPointsLookup(
  dataPoints: DataPoint[] | undefined,
): Map<string, ShortDataPoint[]> {
  return useGroupLookup(
    dataPoints,
    (dp) => `${dp.modelName}-${dp.scenarioName}`,
    (dp) => ({ value: dp.value, year: dp.year }),
  );
}
