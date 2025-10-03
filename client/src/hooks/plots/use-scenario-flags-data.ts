import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { categorizeRuns } from "@/containers/scenario-dashboard/utils/flags-utils";
import { useMemo } from "react";
import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";

export function useScenarioFlagsData(runs: RunPipelineReturn["runs"]) {
  const categories = useMemo(() => categorizeRuns(runs), [runs]);

  const categoriesWithRuns = useMemo(
    () =>
      (Object.keys(categories) as CategoryKey[])
        .map((key) => [key, categories[key]] as const)
        .filter(([, category]) => category.count > 0),
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

  const totalCategories = categoriesWithRuns.length;

  return {
    categories,
    categoriesWithRuns,
    highCategories,
    mediumCategories,
    okCategories,
    totalCategories,
  };
}
