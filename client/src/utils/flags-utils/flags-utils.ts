import {
  CATEGORY_KEYS,
  CategoryKey,
  FEASIBILITY_META_KEY,
  SUSTAINABILITY_META_KEY,
  VALUE_HIGH,
  VALUE_MEDIUM,
  VALUE_OK,
} from "@/lib/config/reasons-of-concern/category-config";
import {
  initializeMetaIndicatorRunCategorySummaryPair,
  MetaIndicatorRunCategorySummaryPair,
} from "@/containers/scenario-dashboard-container/components/runs-pannel/utils";
import { ExtendedRun, ShortMetaIndicator } from "@/types/data/run";

/**
 * Represents the flag analysis results for a single run.
 * @property {boolean} highFeasibility True if run has any "high" severity Plausibility Vetting flags.
 * @property {boolean} mediumFeasibility True if run has any "medium" severity Plausibility Vetting flags.
 * @property {boolean} highSustainability True if run has any "high" severity Reason For Concern flags.
 * @property {boolean} mediumSustainability True if run has any "medium" severity Reason For Concern flags.
 */
type RunFlagAnalysis = {
  highFeasibility: boolean;
  mediumFeasibility: boolean;
  highSustainability: boolean;
  mediumSustainability: boolean;
};

/**
 * Filters meta indicators to only include flag-related ones.
 * e.g. "Feasibility Concern" and "Sustainability Concern" are the keys we are interested in.
 *
 * In the dataset we can find meta indicators with keys like:
 * - "Feasibility Concern|Solar PV"
 * - "Sustainability Concern|Wind Turbine"
 */
const _filterFlagMetaIndicators = (metaIndicators: Array<ShortMetaIndicator>) => {
  return metaIndicators.filter((meta) => {
    const isFeasibilityFlag = meta.key.startsWith(FEASIBILITY_META_KEY);
    const isSustainabilityFlag = meta.key.startsWith(SUSTAINABILITY_META_KEY);

    return isFeasibilityFlag || isSustainabilityFlag;
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
 *  highFeasibility: true,
 *  mediumFeasibility: false,
 *  highSustainability: false,
 *  mediumSustainability: true
 * }
 * ```
 */
const _analyzeRunFlags = (flagMetas: Array<ShortMetaIndicator>): RunFlagAnalysis => {
  const flags: RunFlagAnalysis = {
    highFeasibility: false,
    mediumFeasibility: false,
    highSustainability: false,
    mediumSustainability: false,
  };

  flagMetas.forEach((meta) => {
    const value = meta.value.toLowerCase();

    if (meta.key.startsWith(FEASIBILITY_META_KEY)) {
      if (value === VALUE_HIGH) flags.highFeasibility = true;
      else if (value === VALUE_MEDIUM) flags.mediumFeasibility = true;
    }

    if (meta.key.startsWith(SUSTAINABILITY_META_KEY)) {
      if (value === VALUE_HIGH) flags.highSustainability = true;
      else if (value === VALUE_MEDIUM) flags.mediumSustainability = true;
    }
  });

  return flags;
};

/**
 * Determines the appropriate category key based on flag analysis.
 */
const _categorizeSingleRun = (flags: RunFlagAnalysis) => {
  const hasAnyFeasibilityFlag = flags.highFeasibility || flags.mediumFeasibility;
  const hasAnySustainabilityFlag = flags.highSustainability || flags.mediumSustainability;

  // Case 1: Run has BOTH feasibility AND sustainability flags
  if (hasAnyFeasibilityFlag && hasAnySustainabilityFlag) {
    const hasAnyHighFlag = flags.highFeasibility || flags.highSustainability;
    return hasAnyHighFlag ? CATEGORY_KEYS.BOTH_HIGH : CATEGORY_KEYS.BOTH_MEDIUM;
  }

  // Case 2: Run has ONLY sustainability flags
  if (hasAnySustainabilityFlag && !hasAnyFeasibilityFlag) {
    return flags.highSustainability
      ? CATEGORY_KEYS.HIGH_SUSTAINABILITY
      : CATEGORY_KEYS.MEDIUM_SUSTAINABILITY;
  }

  // Case 3: Run has ONLY feasibility flags
  if (hasAnyFeasibilityFlag && !hasAnySustainabilityFlag) {
    return flags.highFeasibility
      ? CATEGORY_KEYS.HIGH_FEASIBILITY
      : CATEGORY_KEYS.MEDIUM_FEASIBILITY;
  }

  // Case 4: Run has NO relevant flags or all flags are OK
  return CATEGORY_KEYS.NO_FLAGS;
};

/**
 * Filters and extracts category-specific meta indicators from runs based on feasibility and sustainability criteria.
 * This function categorizes runs and then extracts unique meta indicators that match each category's
 * specific criteria (e.g., high feasibility, medium sustainability). It uses Map-based deduplication to ensure only unique meta indicators per category are returned.
 *
 * We need this in order to avoid presenting Sustainability meta-indicators for HIGH_FEASIBILITY for instance.
 *
 * @param runs
 */
export const getMetaIndicatorsForSpecificCategory = (runs: ExtendedRun[]) => {
  const categorisedRuns = categorizeRuns(runs);

  for (const [cat, categorySummary] of Object.entries(categorisedRuns)) {
    const metaIndicators = categorySummary.runs.flatMap((run) => run.metaIndicators);

    if (cat === CATEGORY_KEYS.HIGH_FEASIBILITY) {
      categorisedRuns[cat].categorySpecificMetaIndicators = Array.from(
        new Map(
          metaIndicators
            .filter(
              (metaIndicator) =>
                metaIndicator.key.startsWith(FEASIBILITY_META_KEY) &&
                metaIndicator.value.toLowerCase() === VALUE_HIGH,
            )
            .map((item) => [item.key, item]),
        ).values(),
      );
    } else if (cat === CATEGORY_KEYS.MEDIUM_FEASIBILITY) {
      categorisedRuns[cat].categorySpecificMetaIndicators = Array.from(
        new Map(
          metaIndicators
            .filter(
              (metaIndicator) =>
                metaIndicator.key.startsWith(FEASIBILITY_META_KEY) &&
                metaIndicator.value.toLowerCase() === VALUE_MEDIUM,
            )
            .map((item) => [item.key, item]),
        ).values(),
      );
    } else if (cat === CATEGORY_KEYS.HIGH_SUSTAINABILITY) {
      categorisedRuns[cat].categorySpecificMetaIndicators = Array.from(
        new Map(
          metaIndicators
            .filter(
              (metaIndicator) =>
                metaIndicator.key.startsWith(SUSTAINABILITY_META_KEY) &&
                metaIndicator.value.toLowerCase() === VALUE_HIGH,
            )
            .map((item) => [item.key, item]),
        ).values(),
      );
    } else if (cat === CATEGORY_KEYS.MEDIUM_SUSTAINABILITY) {
      categorisedRuns[cat].categorySpecificMetaIndicators = Array.from(
        new Map(
          metaIndicators
            .filter(
              (metaIndicator) =>
                metaIndicator.key.startsWith(SUSTAINABILITY_META_KEY) &&
                metaIndicator.value.toLowerCase() === VALUE_MEDIUM,
            )
            .map((item) => [item.key, item]),
        ).values(),
      );
    } else if (cat === CATEGORY_KEYS.BOTH_HIGH) {
      categorisedRuns[cat].categorySpecificMetaIndicators = Array.from(
        new Map(
          metaIndicators
            .filter(
              (metaIndicator) =>
                (metaIndicator.key.startsWith(FEASIBILITY_META_KEY) ||
                  metaIndicator.key.startsWith(SUSTAINABILITY_META_KEY)) &&
                metaIndicator.value.toLowerCase() === VALUE_HIGH,
            )
            .map((item) => [item.key, item]),
        ).values(),
      );
    } else if (cat === CATEGORY_KEYS.BOTH_MEDIUM) {
      categorisedRuns[cat].categorySpecificMetaIndicators = Array.from(
        new Map(
          metaIndicators
            .filter(
              (metaIndicator) =>
                (metaIndicator.key.startsWith(FEASIBILITY_META_KEY) ||
                  metaIndicator.key.startsWith(SUSTAINABILITY_META_KEY)) &&
                metaIndicator.value.toLowerCase() === VALUE_MEDIUM,
            )
            .map((item) => [item.key, item]),
        ).values(),
      );
    } else if (cat === CATEGORY_KEYS.NO_FLAGS) {
      categorisedRuns[cat].categorySpecificMetaIndicators = Array.from(
        new Map(
          metaIndicators
            .filter(
              (metaIndicator) =>
                (metaIndicator.key.startsWith(FEASIBILITY_META_KEY) ||
                  metaIndicator.key.startsWith(SUSTAINABILITY_META_KEY)) &&
                metaIndicator.value.toLowerCase() === VALUE_OK,
            )
            .map((item) => [item.key, item]),
        ).values(),
      );
    }
  }

  return categorisedRuns;
};

export const getFlagCategory = (metaIndicators: Array<ShortMetaIndicator>): CategoryKey => {
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
