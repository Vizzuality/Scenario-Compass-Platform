"use client";

import { Label } from "@/components/ui/label";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import { advancedFilterItems } from "@/lib/config/filters/advanced-filters-config";
import { useId } from "react";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import SliderSelect from "@/containers/scenario-dashboard/components/slider-select";

const tooltipInfo =
  "Use advanced filters to refine your search. Select options from the dropdown to filter scenarios based on specific criteria.";

export const AdvancedFilter = () => {
  const id = useId();
  const { advanced, setAdvanced } = useScenarioDashboardUrlParams();

  const handleValueChange = (selectedKey: string | null, rangeString: string) => {
    if (selectedKey) {
      setAdvanced([selectedKey, rangeString]);
    } else {
      setAdvanced(null);
    }
  };

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
        placeholder="Search"
        currentValue={advanced}
        defaultRange={[0, 100]}
        onApply={handleValueChange}
      />
    </div>
  );
};
