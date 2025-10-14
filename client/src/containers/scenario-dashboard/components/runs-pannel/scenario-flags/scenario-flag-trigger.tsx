import { Eye, EyeOff } from "lucide-react";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/use-scenario-flags-selection";
import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { RunCategory } from "@/containers/scenario-dashboard/components/runs-pannel/utils";
import { cn } from "@/lib/utils";

export function BaseFlagTrigger({
  categoryKey,
  category,
  prefix,
  className,
}: {
  categoryKey: CategoryKey;
  category: RunCategory;
  prefix?: string;
  className?: string;
}) {
  const { handleCheckboxChange, isCategorySelected, handleHideToggle, isCategoryHidden } =
    useScenarioFlagsSelection(prefix);

  const isChecked = isCategorySelected(categoryKey);
  const isHidden = isCategoryHidden(categoryKey);

  const onTextClick = (e: React.MouseEvent) => {
    if (isHidden) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
  };

  return (
    <div className={cn("-mr-2 flex w-full items-start justify-between gap-4", className)}>
      <div className="flex items-start gap-2" onClick={onTextClick}>
        <input
          disabled={isHidden}
          type="checkbox"
          className="accent-primary mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300"
          checked={isChecked}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleCheckboxChange(categoryKey, e.target.checked);
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
        <div
          className={cn("mt-1.5 h-2 w-2 rounded-full", isHidden && "opacity-50")}
          style={{ backgroundColor: category.color }}
        />
        <span className={cn("flex-1 text-left text-sm", isHidden && "opacity-50")}>
          <p>{category.label}</p>
          <strong>({category.count} scenarios)</strong>
        </span>
      </div>
      <div className="flex gap-2">
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleHideToggle(categoryKey, !isCategoryHidden(categoryKey));
          }}
        >
          {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </div>
      </div>
    </div>
  );
}
