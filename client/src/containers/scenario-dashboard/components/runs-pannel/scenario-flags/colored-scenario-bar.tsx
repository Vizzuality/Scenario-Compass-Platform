import { CATEGORY_CONFIG, CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { RunCategory } from "@/containers/scenario-dashboard/components/runs-pannel/utils";

interface ColoredBarProps {
  categories: Record<CategoryKey, RunCategory>;
  totalRuns: number;
}

export const ColoredScenarioBar: React.FC<ColoredBarProps> = ({ categories, totalRuns }) => {
  if (totalRuns === 0) return null;

  return (
    <div className="mb-4 flex h-8 w-full overflow-hidden">
      {Object.entries(categories).map(([key, category]) => {
        const percentage = (category.count / totalRuns) * 100;
        if (percentage === 0) return null;

        const categoryKey = key as CategoryKey;
        const backgroundColor = CATEGORY_CONFIG[categoryKey]?.color;

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
