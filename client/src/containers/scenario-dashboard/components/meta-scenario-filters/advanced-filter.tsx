"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectTrigger } from "@/components/ui/select";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";

const tooltipInfo =
  "Use advanced filters to refine your search. Select options from the dropdown to filter scenarios based on specific criteria.";

export const AdvancedFilter = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="advanced" className="leading-6 font-bold">
          Advanced Filters
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <Select>
        <SelectTrigger size="lg" className="w-full" id="advanced" theme="light">
          Select option
        </SelectTrigger>
      </Select>
    </div>
  );
};
