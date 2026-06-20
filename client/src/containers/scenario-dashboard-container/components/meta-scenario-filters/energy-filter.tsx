"use client";

import { Label } from "@/components/ui/label";
import { RowFilterProps } from "@/utils/data-manipulation/get-meta-points";
import TooltipInfo from "@/containers/scenario-dashboard-container/components/tooltip-info";
import SliderSelect from "@/components/slider-select";
import { useEnergyFilter } from "@/hooks/runs/filtering/use-energy-filter";

const tooltipInfo =
  "Energy refers to the sources and types of energy used in scenarios, such as renewable energy, fossil fuels, or nuclear power. This filter allows you to categorize scenarios based on their energy profiles.";

export const EnergyFilter = () => {
  const { id, energyItems, handleApply } = useEnergyFilter();

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Energy
        </Label>
        <TooltipInfo info={tooltipInfo} />
      </div>
      <SliderSelect
        id={id}
        items={energyItems}
        placeholder="Select energy type"
        onApply={handleApply}
      />
    </div>
  );
};

export const EnergyFilterRow = ({ prefix }: RowFilterProps) => {
  const { id, energyItems, handleApply } = useEnergyFilter(prefix);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 flex-shrink-0 leading-5">
          Energy:
        </Label>
        <SliderSelect
          id={id}
          className="h-10 w-48"
          items={energyItems}
          placeholder="Select energy type"
          onApply={handleApply}
        />
      </div>
    </div>
  );
};
