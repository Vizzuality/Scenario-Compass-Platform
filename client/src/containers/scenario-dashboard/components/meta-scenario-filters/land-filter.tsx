"use client";

import { Label } from "@/components/ui/label";
import { RowFilterProps } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import TooltipInfo from "@/containers/scenario-dashboard/components/tooltip-info";
import { useId } from "react";
import SliderSelect, {
  ChangeStateAction,
  SliderSelectItem,
} from "@/containers/scenario-dashboard/components/slider-select";
import {
  INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
  INCREASE_IN_GLOBAL_FOREST_AREA_LABEL,
} from "@/lib/config/filters/land-filter-config";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/filter/use-filter-url-params";
import { parseRange } from "@/containers/scenario-dashboard/components/slider-select/utils";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard/utils/url-store";

const tooltipInfo =
  "Land refers to the use and management of land resources in scenarios, including aspects like deforestation, urbanization, and agricultural practices. This filter allows you to categorize scenarios based on their land use impact.";

const useLandFilter = (prefix?: string) => {
  const id = useId();
  const { gfaIncrease, setGfaIncrease } = useFilterUrlParams(prefix);

  const landItems: Array<SliderSelectItem> = [
    {
      id: INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
      label: INCREASE_IN_GLOBAL_FOREST_AREA_LABEL,
      defaultRange: [-100, 100],
      value: parseRange(gfaIncrease as string | null),
    },
  ];

  const setters: Record<string, (value: string | null) => Promise<URLSearchParams>> = {
    gfaIncrease: setGfaIncrease,
  };

  const handleApply = (selections: ChangeStateAction) => {
    Object.entries(selections).forEach(([key, value]) => {
      const setter = setters[key];
      const stringifierValue = value ? value.join(URL_VALUES_FILTER_SEPARATOR) : null;
      setter?.(stringifierValue);
    });
  };

  return { id, landItems, handleApply };
};

export const LandFilter = () => {
  const { id, landItems, handleApply } = useLandFilter();

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="leading-6 font-bold">
          Filter by land-related indicator
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
          className="h-10 w-fit"
          placeholder="Select land filter"
          onApply={handleApply}
        />
      </div>
    </div>
  );
};
