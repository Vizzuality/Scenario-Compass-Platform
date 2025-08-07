import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  SCENARIO_FILTER_OPTIONS,
  ScenarioFilterType,
} from "@/containers/scenario-dashboard/utils/url-store";

interface Props {
  children: React.ReactNode;
  selectedFilters: ScenarioFilterType[];
  onApply: (filters: ScenarioFilterType[]) => void;
}

export const ComparisonFilterPopover: React.FC<Props> = ({
  children,
  selectedFilters = [],
  onApply,
}) => {
  const [internalFiltersState, setInternalFiltersState] =
    React.useState<ScenarioFilterType[]>(selectedFilters);

  const toggleFilter = (filter: ScenarioFilterType) => {
    const isActive = internalFiltersState.includes(filter);
    const newFilters = isActive
      ? internalFiltersState.filter((f) => f !== filter)
      : [...internalFiltersState, filter];
    setInternalFiltersState(newFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-3">
            {Object.values(SCENARIO_FILTER_OPTIONS).map((filter) => (
              <div key={filter} className="flex items-center gap-2">
                <Checkbox
                  id={filter.toUpperCase()}
                  checked={internalFiltersState.includes(filter)}
                  onCheckedChange={() => toggleFilter(filter)}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor={filter.toUpperCase()}
                  className="cursor-pointer text-base font-medium"
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Label>
              </div>
            ))}
          </div>

          <PopoverClose asChild>
            <Button
              disabled={!internalFiltersState.length}
              onClick={() => onApply(internalFiltersState)}
              variant="outline"
              className="w-full"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
