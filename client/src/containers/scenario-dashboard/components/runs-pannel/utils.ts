import { ExtendedRun } from "@/hooks/runs/pipeline/types";
import { CATEGORY_CONFIG, CategoryKey } from "@/lib/config/reasons-of-concern/category-config";

/**
 * Represents the data for a single category of simulation runs.
 *
 * This object acts as the value in a map-like structure where the key is a
 * `CategoryKey`. It bundles the display properties and the underlying data
 * for that specific group of runs.
 *
 * @see {CategoryKey} for the list of possible category identifiers.
 */
export interface RunCategorySummary {
  /** The full, human-readable name of the category (e.g., "High sustainability concerns"). */
  label: string;

  /** The total count of unique runs that fall into this category. */
  count: number;

  /** The primary hex color code used to represent this category visually. */
  color: string;

  /** An array containing the actual run objects that belong to this category. */
  runs: ExtendedRun[];
}

export type MetaIndicatorRunCategorySummaryPair = Record<CategoryKey, RunCategorySummary>;

export const initializeMetaIndicatorRunCategorySummaryPair = () => {
  return Object.fromEntries(
    Object.entries(CATEGORY_CONFIG).map(([key, config]) => [
      key,
      { color: config.color, label: config.label, count: 0, runs: [] },
    ]),
  ) as unknown as MetaIndicatorRunCategorySummaryPair;
};

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
      .sort((a, b) => {
        if (key === "Project") {
          return a.value.localeCompare(b.value);
        } else {
          return b.count - a.count;
        }
      });
  });

  return result;
};
