import { RunPipelineReturn } from "@/types/data/run";
import { getMetaIndicatorsForSpecificCategory } from "@/utils/flags-utils/flags-utils";
import { useMemo } from "react";
import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { RunCategorySummary } from "@/containers/scenario-dashboard-container/components/runs-pannel/utils";

/**
 * Custom hook that categorizes and organizes scenario runs based on their flag status.
 *
 * This hook processes a list of runs and groups them into severity categories (HIGH, MEDIUM, OK)
 * based on their associated flags. It provides a structured view of runs for dashboard display
 * and analysis purposes.
 *
 * @param runs - Array of runs from the pipeline to be categorized
 *
 * @returns An object containing categorized run data:
 * - `totalCountOfUniqueRuns`: Total number of unique runs across all categories
 * - `categories`: Complete categorization object mapping category keys to run summaries
 * - `highCategories`: Array of HIGH severity category entries
 * - `mediumCategories`: Array of MEDIUM severity category entries
 * - `okCategories`: Array of OK/NO severity category entries
 *
 * @remarks
 * - Categories are determined by the presence of "HIGH", "NO", or other keywords in the category key
 * - Only categories with at least one run (count > 0) are included in the filtered results
 * - Category keys containing "HIGH" are considered high severity
 * - Category keys containing "NO" are considered ok/no issues
 * - All other categories are considered medium severity
 */
export function useScenarioFlagsData(runs: RunPipelineReturn["runs"]) {
  const categories = getMetaIndicatorsForSpecificCategory(runs);

  /**
   * Filters out empty categories (those with no runs).
   * Returns only categories that contain at least one run.
   */
  const categoriesWithRuns = useMemo(
    () =>
      (Object.entries(categories) as [CategoryKey, RunCategorySummary][]).filter(
        ([, category]) => category.count > 0,
      ),
    [categories],
  );

  const { highCategories, mediumCategories, okCategories } = useMemo(
    () =>
      categoriesWithRuns.reduce(
        (acc, category) => {
          if (category[0].includes("HIGH")) {
            acc.highCategories.push(category);
          } else if (category[0].includes("NO")) {
            acc.okCategories.push(category);
          } else {
            acc.mediumCategories.push(category);
          }
          return acc;
        },
        {
          highCategories: [] as typeof categoriesWithRuns,
          mediumCategories: [] as typeof categoriesWithRuns,
          okCategories: [] as typeof categoriesWithRuns,
        },
      ),
    [categoriesWithRuns],
  );

  /**
   * Calculates the total number of unique runs across all categories.
   * Sums up the count property from each category.
   */
  const totalCountOfUniqueRuns = categoriesWithRuns.reduce(
    (sum, [, category]) => sum + category.count,
    0,
  );

  return {
    totalCountOfUniqueRuns,
    categories,
    highCategories,
    mediumCategories,
    okCategories,
  };
}
