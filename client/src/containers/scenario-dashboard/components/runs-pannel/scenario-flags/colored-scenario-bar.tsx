"use client";

import { CATEGORY_CONFIG, CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { RunCategorySummary } from "@/containers/scenario-dashboard/components/runs-pannel/utils";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/use-scenario-flags-selection";

interface ColoredBarProps {
  categories: Record<CategoryKey, RunCategorySummary>;
  totalRuns: number;
  prefix?: string;
}

export const ColoredScenarioBar: React.FC<ColoredBarProps> = ({
  categories,
  totalRuns,
  prefix,
}) => {
  const { selectedFlags, hiddenFlags } = useScenarioFlagsSelection(prefix);
  if (totalRuns === 0) return null;

  const getBackgroundColor = (categoryKey: CategoryKey): string | undefined => {
    const abbrev = CATEGORY_CONFIG[categoryKey]?.abbrev;
    const isFlagSelected = abbrev ? selectedFlags.includes(abbrev) : false;
    const isFlagHidden = abbrev ? hiddenFlags.includes(abbrev) : false;
    const atLeastOneFlagSelected = selectedFlags.length > 0;
    const atLeastOneFlagHidden = hiddenFlags.length > 0;

    if (atLeastOneFlagSelected) {
      if (isFlagSelected) {
        return CATEGORY_CONFIG[categoryKey]?.color;
      } else if (isFlagHidden) {
        return "white";
      } else {
        return "#E7E5E4";
      }
    }

    if (atLeastOneFlagHidden) {
      if (isFlagHidden) {
        return "white";
      } else {
        return CATEGORY_CONFIG[categoryKey]?.color;
      }
    }

    return CATEGORY_CONFIG[categoryKey]?.color;
  };

  return (
    <div className="mb-4 flex h-8 w-full overflow-hidden">
      {Object.entries(categories).map(([key, category]) => {
        const percentage = (category.count / totalRuns) * 100;
        if (percentage === 0) return null;

        const categoryKey = key as CategoryKey;
        const backgroundColor = getBackgroundColor(categoryKey);

        return (
          <div
            key={key}
            style={{
              width: `${percentage}%`,
              backgroundColor,
            }}
            title={`${category.label}: ${category.count} runs (${percentage.toFixed(2)}%)`}
            tabIndex={0}
            aria-label={`${category.label}: ${category.count} of ${totalRuns} runs, ${percentage.toFixed(1)} percent`}
          />
        );
      })}
    </div>
  );
};
