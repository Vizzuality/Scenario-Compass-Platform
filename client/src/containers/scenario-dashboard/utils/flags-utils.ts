import {
  CATEGORY_CONFIG,
  CATEGORY_KEYS,
  CategoryKey,
  FEASIBILITY_META_KEY,
  SUSTAINABILITY_META_KEY,
  VALUE_HIGH,
  VALUE_MEDIUM,
} from "@/lib/config/reasons-of-concern/category-config";
import { RunCategory } from "@/containers/scenario-dashboard/components/runs-pannel/utils";
import { ExtendedRun, ShortMetaIndicator } from "@/hooks/runs/pipeline/types";

/**
 * Represents the flag analysis results for a single run.
 * Each boolean indicates whether the run contains that specific type of flag.
 */
type RunFlagAnalysis = {
  /** True if run has any "high" severity Plausibility Vetting flags */
  highPlausibility: boolean;
  /** True if run has any "medium" severity Plausibility Vetting flags */
  mediumPlausibility: boolean;
  /** True if run has any "high" severity Reason For Concern flags */
  highConcern: boolean;
  /** True if run has any "medium" severity Reason For Concern flags */
  mediumConcern: boolean;
};

/**
 * Filters meta indicators to only include flag-related ones.
 * e.g. "Plausibility Vetting" and "Reason For Concern" are the keys we are interested in.
 * In the dataset we can find meta indicators with keys like:
 * - "Plausibility Vetting|Solar PV"
 * - "Reason For Concern|Wind Turbine"
 */
export const _filterFlagMetaIndicators = (metaIndicators: Array<ShortMetaIndicator>) => {
  return metaIndicators.filter((meta) => {
    const isPlausibilityFlag = meta.key.startsWith(FEASIBILITY_META_KEY);
    const isConcernFlag = meta.key.startsWith(SUSTAINABILITY_META_KEY);

    return isPlausibilityFlag || isConcernFlag;
  });
};

/**
 * Counts occurrences of flag-related meta indicators across runs.
 */
export const _getKeyCounts = (runs: ExtendedRun[]): Array<[string, number]> => {
  const keyCounts = new Map<string, number>();

  runs.forEach((run) => {
    _filterFlagMetaIndicators(run.metaIndicators).forEach((meta) => {
      keyCounts.set(meta.key, (keyCounts.get(meta.key) || 0) + 1);
    });
  });

  return Array.from(keyCounts.entries()).sort(([a], [b]) => a.localeCompare(b));
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
 * Categorizes runs based on their flag meta indicators into predefined categories.
 *
 * Analyzes each run's flags to determine which category it belongs to
 * based on a priority hierarchy: both types > concern only > plausibility only > no flags.
 */
export const categorizeRuns = (runs: ExtendedRun[]): Record<CategoryKey, RunCategory> => {
  const categories = Object.fromEntries(
    Object.entries(CATEGORY_CONFIG).map(([key, config]) => [
      key,
      { ...config, count: 0, runs: [] },
    ]),
  ) as unknown as Record<CategoryKey, RunCategory>;

  runs.forEach((run) => {
    categories[run.flagCategory].runs.push(run);
  });

  Object.values(categories).forEach((category) => {
    category.count = category.runs.length;
  });

  return categories;
};
