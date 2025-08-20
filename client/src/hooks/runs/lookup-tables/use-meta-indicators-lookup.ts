import { ShortMetaIndicator } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { useGroupLookup } from "@/hooks/runs/lookup-tables/use-group-lookup";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";

export function useMetaIndicatorsLookup(
  metaData: MetaIndicator[] | undefined,
): Map<string, ShortMetaIndicator[]> {
  return useGroupLookup(
    metaData,
    (meta) => `${meta.modelName}-${meta.scenarioName}`,
    (meta) => ({ value: meta.value, key: meta.key }),
  );
}
