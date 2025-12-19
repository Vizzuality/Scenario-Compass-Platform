import {
  CATEGORY_KEYS,
  CategoryKey,
  FEASIBILITY_META_KEY,
  SUSTAINABILITY_META_KEY,
  VALUE_HIGH,
  VALUE_MEDIUM,
} from "@/lib/config/reasons-of-concern/category-config";
import {
  initializeMetaIndicatorRunCategorySummaryPair,
  MetaIndicatorRunCategorySummaryPair,
} from "@/containers/scenario-dashboard-container/components/runs-pannel/utils";
import { ExtendedRun, ShortMetaIndicator } from "@/types/data/run";

/**
 * Represents the flag analysis results for a single run.
 * @property {boolean} highPlausibility True if run has any "high" severity Plausibility Vetting flags.
 * @property {boolean} mediumPlausibility True if run has any "medium" severity Plausibility Vetting flags.
 * @property {boolean} highConcern True if run has any "high" severity Reason For Concern flags.
 * @property {boolean} mediumConcern True if run has any "medium" severity Reason For Concern flags.
 */
type RunFlagAnalysis = {
  highPlausibility: boolean;
  mediumPlausibility: boolean;
  highConcern: boolean;
  mediumConcern: boolean;
};

/**
 * Filters meta indicators to only include flag-related ones.
 * e.g. "Feasibility Concern" and "Sustainability Concern" are the keys we are interested in.
 *
 * In the dataset we can find meta indicators with keys like:
 * - "Feasibility Concern|Solar PV"
 * - "Sustainability Concern|Wind Turbine"
 */
export const _filterFlagMetaIndicators = (metaIndicators: Array<ShortMetaIndicator>) => {
  return metaIndicators.filter((meta) => {
    const isPlausibilityFlag = meta.key.startsWith(FEASIBILITY_META_KEY);
    const isConcernFlag = meta.key.startsWith(SUSTAINABILITY_META_KEY);

    return isPlausibilityFlag || isConcernFlag;
  });
};

interface MetaIndicatorOccurrencePair {
  metaIndicator: string;
  count: number;
}

/**
 * Counts occurrences of flag-related meta indicators across runs.
 *
 * Returns an array of Map
 */
export const getMetaIndicatorsOccurrenceCounts = (
  runs: ExtendedRun[],
): Array<MetaIndicatorOccurrencePair> => {
  const uniqueRuns = Array.from(new Map(runs.map((run) => [run.runId, run])).values());

  const keyCounts = new Map<string, number>();

  uniqueRuns.forEach((run) => {
    _filterFlagMetaIndicators(run.metaIndicators).forEach((meta) => {
      keyCounts.set(meta.key, (keyCounts.get(meta.key) || 0) + 1);
    });
  });

  return Array.from(keyCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({
      metaIndicator: key,
      count: count,
    }));
};

/**
 * Analyzes a single run's flag-related meta indicators to determine what types of flags are present.
 *
 * @param flagMetas - Array of flag-related meta indicators from a single run
 * @returns Object indicating which types of flags were found in the run
 *
 * @example
 * ```typescript
 * const flagMetas = [
 *   { key: "Plausibility Vetting|Solar", value: "high" },
 *   { key: "Reason For Concern|Wind", value: "medium" }
 * ];
 *
 * const result = analyzeRunFlags(flagMetas);
 * Returns: {
 *  highPlausibility: true,
 *  mediumPlausibility: false,
 *  highConcern: false,
 *  mediumConcern: true
 * }
 * ```
 */
const _analyzeRunFlags = (flagMetas: Array<ShortMetaIndicator>): RunFlagAnalysis => {
  const flags: RunFlagAnalysis = {
    highPlausibility: false,
    mediumPlausibility: false,
    highConcern: false,
    mediumConcern: false,
  };

  flagMetas.forEach((meta) => {
    const value = meta.value.toLowerCase();

    if (meta.key.startsWith(FEASIBILITY_META_KEY)) {
      if (value === VALUE_HIGH) flags.highPlausibility = true;
      else if (value === VALUE_MEDIUM) flags.mediumPlausibility = true;
    }

    if (meta.key.startsWith(SUSTAINABILITY_META_KEY)) {
      if (value === VALUE_HIGH) flags.highConcern = true;
      else if (value === VALUE_MEDIUM) flags.mediumConcern = true;
    }
  });

  return flags;
};

/**
 * Determines the appropriate category key based on flag analysis.
 */
const _categorizeSingleRun = (flags: RunFlagAnalysis) => {
  const hasAnyPlausibilityFlag = flags.highPlausibility || flags.mediumPlausibility;
  const hasAnyConcernFlag = flags.highConcern || flags.mediumConcern;

  // Case 1: Run has BOTH plausibility AND concern flags
  if (hasAnyPlausibilityFlag && hasAnyConcernFlag) {
    const hasAnyHighFlag = flags.highPlausibility || flags.highConcern;
    return hasAnyHighFlag ? CATEGORY_KEYS.BOTH_HIGH : CATEGORY_KEYS.BOTH_MEDIUM;
  }

  // Case 2: Run has ONLY concern flags
  if (hasAnyConcernFlag && !hasAnyPlausibilityFlag) {
    return flags.highConcern
      ? CATEGORY_KEYS.HIGH_SUSTAINABILITY
      : CATEGORY_KEYS.MEDIUM_SUSTAINABILITY;
  }

  // Case 3: Run has ONLY plausibility flags
  if (hasAnyPlausibilityFlag && !hasAnyConcernFlag) {
    return flags.highPlausibility
      ? CATEGORY_KEYS.HIGH_FEASIBILITY
      : CATEGORY_KEYS.MEDIUM_FEASIBILITY;
  }

  // Case 4: Run has NO relevant flags or all flags are OK
  return CATEGORY_KEYS.NO_FLAGS;
};

export const getRunCategory = (metaIndicators: Array<ShortMetaIndicator>): CategoryKey => {
  const flagMetas = _filterFlagMetaIndicators(metaIndicators);
  const flags = _analyzeRunFlags(flagMetas);
  return _categorizeSingleRun(flags);
};

/**
 * Groups a list of runs into predefined categories based on their flag analysis.
 *
 * This utility deduplicates runs by `runId` and then organizes them into buckets.
 * The categories are determined by a **strict priority hierarchy**, where a run is placed
 * in the highest-ranking category it qualifies for:
 *
 * 1.  **Both Types**: Runs with both "Reason for Concern" and "Plausibility" flags.
 * 2.  **Concern Only**: Runs with only "Reason for Concern" flags.
 * 3.  **Plausibility Only**: Runs with only "Plausibility" flags.
 * 4.  **No Flags**: Runs with neither type of flag.
 *
 * @param {ExtendedRun[]} runs An array of run objects to be categorized, each expected to have a `flagCategory` property reflecting this hierarchy.
 * @returns {Record<CategoryKey, RunCategorySummary>} An object where each key is a category, containing the runs and the total count of unique runs in that category.
 */
export const categorizeRuns = (runs: ExtendedRun[]): MetaIndicatorRunCategorySummaryPair => {
  const activeCategories = initializeMetaIndicatorRunCategorySummaryPair();
  runs.forEach((run) => {
    activeCategories[run.flagCategory].runs.push(run);
  });

  Object.values(activeCategories).forEach((category) => {
    const uniqueRunIdsForCategory = [...new Set(category.runs.map((run) => run.runId))];
    category.count = uniqueRunIdsForCategory.length;
  });

  return activeCategories;
};
