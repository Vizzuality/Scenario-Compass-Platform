"use client";

import { Label } from "@/components/ui/label";
import { RowFilterProps } from "@/utils/data-manipulation/get-meta-points";
import TooltipInfo from "@/containers/scenario-dashboard-container/components/tooltip-info";
import SliderSelect from "@/components/slider-select";
import { useLandFilter } from "@/hooks/runs/filtering/use-land-filter";

const tooltipInfo =
  "Land refers to the use and management of land resources in scenarios, including aspects like deforestation, urbanization, and agricultural practices. This filter allows you to categorize scenarios based on their land use impact.";

export const LandFilter = () => {
  const { id, landItems, handleApply } = useLandFilter();

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Land use
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <SliderSelect
        id={id}
        min={-100}
        max={100}
        items={landItems}
        placeholder="Select land filter"
        onApply={handleApply}
      />
    </div>
  );
};

export const LandFilterRow = ({ prefix }: RowFilterProps) => {
  const { id, landItems, handleApply } = useLandFilter(prefix);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 flex-shrink-0 leading-5">
          Land use:
        </Label>
        <SliderSelect
          id={id}
          items={landItems}
          className="h-10 w-48"
          placeholder="Select land filter"
          onApply={handleApply}
        />
      </div>
    </div>
  );
};
