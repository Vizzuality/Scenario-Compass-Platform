"use client";

import { Label } from "@/components/ui/label";
import TooltipInfo from "@/containers/scenario-dashboard-container/components/tooltip-info";
import SliderSelect from "@/components/slider-select";
import { useAdvancedFilter } from "@/hooks/runs/filtering/use-advanced-filter";
import { RowFilterProps } from "@/utils/data-manipulation/get-meta-points";

const tooltipInfo =
  "Use advanced filters to refine your search. Select options from the dropdown to filter scenarios based on specific criteria.";

export const AdvancedFilter = () => {
  const { id, advancedFilterItems, handleApply } = useAdvancedFilter();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Advanced Filters
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <SliderSelect
        id={id}
        items={advancedFilterItems}
        placeholder="Select advanced filter"
        onApply={handleApply}
        type="range"
      />
    </div>
  );
};

export const AdvancedFilterRow = ({ prefix }: RowFilterProps) => {
  const { id, advancedFilterItems, handleApply } = useAdvancedFilter(prefix);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 flex-shrink-0 leading-5">
          Advanced:
        </Label>
        <SliderSelect
          id={id}
          className="h-10 w-48"
          items={advancedFilterItems}
          placeholder="Select advanced filter"
          onApply={handleApply}
          type="range"
        />
      </div>
    </div>
  );
};
