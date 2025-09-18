"use client";

import { Label } from "@/components/ui/label";
import { RowFilterProps } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useId } from "react";
import SliderSelect from "@/containers/scenario-dashboard/components/slider-select";
import { energyTypes } from "@/lib/config/filters/energy-filter-config";

const tooltipInfo =
  "Energy refers to the sources and types of energy used in scenarios, such as renewable energy, fossil fuels, or nuclear power. This filter allows you to categorize scenarios based on their energy profiles.";

const energyItems = energyTypes.map((energy) => ({
  id: energy.key,
  label: energy.label,
}));

export const EnergyFilter = () => {
  const id = useId();
  const { energy, setEnergy } = useScenarioDashboardUrlParams();

  const handleValueChange = (selectedKey: string | null, rangeString: string) => {
    if (selectedKey) {
      setEnergy([selectedKey, rangeString]);
    } else {
      setEnergy(null);
    }
  };

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
        currentValue={energy}
        defaultRange={[0, 100]}
        onApply={handleValueChange}
      />
    </div>
  );
};

export const EnergyFilterRow = ({ prefix, onDelete }: RowFilterProps) => {
  const id = useId();
  const { energy, setEnergy } = useScenarioDashboardUrlParams(prefix);

  const handleValueChange = (selectedKey: string | null, rangeString: string) => {
    if (selectedKey) {
      setEnergy([selectedKey, rangeString]);
    } else {
      setEnergy(null);
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 flex-shrink-0 leading-5">
          Energy:
        </Label>
        <SliderSelect
          id={id}
          className="h-10 w-fit"
          items={energyItems}
          placeholder="Select energy type"
          defaultRange={[0, 100]}
          currentValue={energy}
          onApply={handleValueChange}
        />
      </div>
      {onDelete && (
        <Button variant="ghost" onClick={onDelete}>
          <Trash2Icon size={16} />
        </Button>
      )}
    </div>
  );
};
