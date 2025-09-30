"use client";

import { Label } from "@/components/ui/label";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import { useId } from "react";
import SliderSelect, {
  ChangeStateAction,
  SliderSelectItem,
} from "@/containers/scenario-dashboard/components/slider-select";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/filter/use-filter-url-params";
import { CARBON_REMOVAL_KEY } from "@/lib/config/filters/advanced-filters-config";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard/utils/url-store";
import { parseRange } from "@/containers/scenario-dashboard/components/slider-select/utils";

const tooltipInfo =
  "Use advanced filters to refine your search. Select options from the dropdown to filter scenarios based on specific criteria.";

export const AdvancedFilter = () => {
  const id = useId();
  const { carbonRemoval, setCarbonRemoval } = useFilterUrlParams();

  const setters: Record<string, (value: string | null) => Promise<URLSearchParams>> = {
    carbonRemoval: setCarbonRemoval,
  };

  const handleApply = (selections: ChangeStateAction) => {
    Object.entries(selections).forEach(([key, value]) => {
      const setter = setters[key];
      const stringifierValue = value ? value.join(URL_VALUES_FILTER_SEPARATOR) : null;
      setter?.(stringifierValue);
    });
  };

  const advancedFilterItems: SliderSelectItem[] = [
    {
      id: CARBON_REMOVAL_KEY,
      label: "Carbon Removal",
      defaultRange: [0, 100],
      value: parseRange(carbonRemoval as string | null),
    },
  ];

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
      />
    </div>
  );
};
