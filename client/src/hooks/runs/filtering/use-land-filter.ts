import { useId } from "react";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import { ChangeStateAction, SliderSelectItem } from "@/components/slider-select";
import {
  INCREASE_IN_GLOBAL_FOREST_AREA_KEY,
  INCREASE_IN_GLOBAL_FOREST_AREA_LABEL,
} from "@/lib/config/filters/land-filter-config";
import { parseRange } from "@/components/slider-select/utils";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard-container/url-store";

export const useLandFilter = (prefix?: string) => {
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
