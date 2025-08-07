import { AccordionTrigger } from "@/components/ui/accordion";
import { Eye, EyeOff, InfoIcon } from "lucide-react";
import { useScenarioFlagsSelection } from "@/hooks/nuqs/use-scenario-flags-selection";
import { CategoryKey } from "@/containers/scenario-dashboard/utils/category-config";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RunCategory } from "@/containers/scenario-dashboard/components/runs-pannel/utils";

export default function ScenarioFlagTrigger({
  categoryKey,
  category,
  prefix,
}: {
  categoryKey: CategoryKey;
  category: RunCategory;
  prefix?: string;
}) {
  const { handleCheckboxChange, isCategorySelected, handleHideToggle, isCategoryHidden } =
    useScenarioFlagsSelection(prefix);

  return (
    <AccordionTrigger className="[&_svg]:text-foreground flex w-full items-center px-0 py-2">
      <div className="-mr-2 flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-primary h-4 w-4 rounded border-gray-300"
            checked={isCategorySelected(categoryKey)}
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
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
          <span className="flex-1 text-left text-sm">
            {category.label} <strong>({category.count})</strong>
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
            {isCategoryHidden(categoryKey) ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                For more information about this flag, please refer to the link below:
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </AccordionTrigger>
  );
}
