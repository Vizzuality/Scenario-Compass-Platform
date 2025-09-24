"use client";

import { Label } from "@/components/ui/label";
import { RowFilterProps } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import { useId } from "react";
import SliderSelect from "@/containers/scenario-dashboard/components/slider-select";
import {
  INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
  INCREASE_IN_GLOBAL_FOREST_AREA_LABEL,
} from "@/lib/config/filters/land-filter-config";

const tooltipInfo =
  "Land refers to the use and management of land resources in scenarios, including aspects like deforestation, urbanization, and agricultural practices. This filter allows you to categorize scenarios based on their land use impact.";

const item = {
  id: INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
  label: INCREASE_IN_GLOBAL_FOREST_AREA_LABEL,
};

const useLandFilter = (prefix?: string) => {
  const id = useId();
  const { land, setLand } = useScenarioDashboardUrlParams(prefix);

  const handleValueChange = (selectedKey: string | null, rangeString: string) => {
    if (selectedKey) {
      setLand([selectedKey, rangeString]);
    } else {
      setLand(null);
    }
  };

  return { id, land, handleValueChange };
};

export const LandFilter = () => {
  const { id, land, handleValueChange } = useLandFilter();

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
        defaultRange={[-100, 100]}
        items={[item]}
        placeholder="Select land filter"
        currentValue={land}
        onApply={handleValueChange}
      />
    </div>
  );
};

export const LandFilterRow = ({ prefix }: RowFilterProps) => {
  const { id, land, handleValueChange } = useLandFilter(prefix);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full gap-2">
        <Label htmlFor={id} className="w-20 flex-shrink-0 leading-5">
          Land use:
        </Label>
        <SliderSelect
          id={id}
          min={-100}
          max={100}
          className="h-10 w-fit"
          defaultRange={[-100, 100]}
          items={[item]}
          placeholder="Select land filter"
          currentValue={land}
          onApply={handleValueChange}
        />
      </div>
    </div>
  );
};
