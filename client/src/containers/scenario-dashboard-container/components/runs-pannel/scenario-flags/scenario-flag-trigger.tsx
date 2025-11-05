import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/flags/use-scenario-flags-selection";
import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { RunCategorySummary } from "@/containers/scenario-dashboard-container/components/runs-pannel/utils";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function BaseFlagTrigger({
  categoryKey,
  category,
  prefix,
  className,
  showChevron = false,
}: {
  categoryKey: CategoryKey;
  category: RunCategorySummary;
  prefix?: string;
  className?: string;
  showChevron?: boolean;
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
        <Tooltip>
          <TooltipTrigger>
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
          </TooltipTrigger>
          <TooltipContent>
            {isChecked ? <p>Unmask scenarios</p> : <p>Highlight scenarios</p>}
          </TooltipContent>
        </Tooltip>
        <div
          className={cn("mt-1.5 h-2 w-2 rounded-full", isHidden && "opacity-50")}
          style={{ backgroundColor: category.color }}
        />
        <span className={cn("flex-1 text-left text-sm", isHidden && "opacity-50")}>
          <p>{category.label}</p>
        </span>
      </div>
      <div className="flex gap-2">
        <div
          className="-mt-0.5 flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleHideToggle(categoryKey, !isCategoryHidden(categoryKey));
          }}
        >
          <Tooltip>
            <TooltipTrigger>
              <strong className="-mt-[2px] pt-0.5">{category.count}</strong>
            </TooltipTrigger>
            <TooltipContent>Number of scenarios</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </TooltipTrigger>
            <TooltipContent>
              {!isHidden ? <p>Hide scenarios</p> : <p>Show scenarios</p>}
            </TooltipContent>
          </Tooltip>
          {showChevron && <ChevronDown className="h-4 w-4 opacity-50" />}
        </div>
      </div>
    </div>
  );
}
