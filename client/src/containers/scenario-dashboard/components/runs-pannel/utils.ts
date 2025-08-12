import { ExtendedRun } from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";

export interface RunCategory {
  label: string;
  count: number;
  color: string;
  runs: ExtendedRun[];
}

export const ADDITIONAL_INFORMATION_META_INDICATORS = [
  { key: "Project", label: "Projects" },
  { key: "Scientific Manuscript (Citation)", label: "Citations" },
  { key: "Scientific Manuscript (DOI)", label: "DOI" },
  { key: "Data Source (DOI)", label: "Data Sources" },
];

export const getAdditionalInformationMetaIndicatorCounts = (runs: ExtendedRun[]) => {
  const countsMap = new Map<string, Map<string, number>>();

  ADDITIONAL_INFORMATION_META_INDICATORS.forEach(({ key }) => countsMap.set(key, new Map()));

  runs.forEach((run) => {
    run.metaIndicators.forEach((meta) => {
      const sectionMap = countsMap.get(meta.key);
      if (sectionMap) {
        sectionMap.set(meta.value, (sectionMap.get(meta.value) || 0) + 1);
      }
    });
  });

  const result: Record<string, Array<{ value: string; count: number }>> = {};
  ADDITIONAL_INFORMATION_META_INDICATORS.forEach(({ key }) => {
    result[key] = Array.from(countsMap.get(key)!.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
  });

  return result;
};
