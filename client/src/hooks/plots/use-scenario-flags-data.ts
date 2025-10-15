import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { categorizeRuns } from "@/containers/scenario-dashboard/utils/flags-utils";
import { useMemo } from "react";
import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { RunCategorySummary } from "@/containers/scenario-dashboard/components/runs-pannel/utils";

export function useScenarioFlagsData(runs: RunPipelineReturn["runs"]) {
  const categories = useMemo(() => categorizeRuns(runs), [runs]);

  const categoriesWithRuns = (
    Object.entries(categories) as [CategoryKey, RunCategorySummary][]
  ).filter(([, category]) => category.count > 0);

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
