import { useId } from "react";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import { ChangeStateAction, SliderSelectItem } from "@/components/slider-select";
import {
  CARBON_REMOVAL_KEY,
  END_OF_CENTURY_WARMING_KEY,
  PEAK_WARMING_KEY,
} from "@/lib/config/filters/advanced-filters-config";
import { parseRange } from "@/components/slider-select/utils";
import { URL_VALUES_FILTER_SEPARATOR } from "@/containers/scenario-dashboard-container/url-store";
import { useAtomValue } from "jotai";
import { carbonRemovalMaxAtom, carbonRemovalMinAtom } from "@/utils/atoms/carbon-removal-atoms";
import {
  endOfCenturyWarmingMaxAtom,
  endOfCenturyWarmingMinAtom,
} from "@/utils/atoms/end-of-century-warming-atoms";
import { peakWarmingMaxAtom, peakWarmingMinAtom } from "@/utils/atoms/peak-warming-atoms";

export const useAdvancedFilter = (prefix?: string) => {
  const id = useId();
  const {
    carbonRemoval,
    setCarbonRemoval,
    eocWarming,
    setEocWarming,
    peakWarming,
    setPeakWarming,
  } = useFilterUrlParams(prefix);

  const carbonRemovalMin = useAtomValue(carbonRemovalMinAtom);
  const carbonRemovalMax = useAtomValue(carbonRemovalMaxAtom);
  const carbonRemovalSliderMin = Math.floor(carbonRemovalMin * 10) / 10;
  const carbonRemovalSliderMax = Math.ceil(carbonRemovalMax * 10) / 10;

  const endOfCenturyMin = useAtomValue(endOfCenturyWarmingMinAtom);
  const endOfCenturyMax = useAtomValue(endOfCenturyWarmingMaxAtom);
  const endOfCenturySliderMin = Math.floor(endOfCenturyMin * 10) / 10;
  const endOfCenturySliderMax = Math.ceil(endOfCenturyMax * 10) / 10;

  const peakWarmingMin = useAtomValue(peakWarmingMinAtom);
  const peakWarmingMax = useAtomValue(peakWarmingMaxAtom);
  const peakWarmingSliderMin = Math.floor(peakWarmingMin * 10) / 10;
  const peakWarmingSliderMax = Math.ceil(peakWarmingMax * 10) / 10;

  const advancedFilterItems: SliderSelectItem[] = [
    {
      id: CARBON_REMOVAL_KEY,
      label: "Carbon Removal (Gt CO2)",
      defaultRange: [carbonRemovalSliderMin, carbonRemovalSliderMax],
      value: parseRange(carbonRemoval as string | null),
      min: carbonRemovalSliderMin,
      max: carbonRemovalSliderMax,
      step: 0.1,
    },
    {
      id: END_OF_CENTURY_WARMING_KEY,
      label: "End of Century Warming (°C)",
      defaultRange: [endOfCenturySliderMin, endOfCenturySliderMax],
      value: parseRange(eocWarming as string | null),
      min: endOfCenturySliderMin,
      max: endOfCenturySliderMax,
      step: 0.1,
    },
    {
      id: PEAK_WARMING_KEY,
      label: "Peak Warming (°C)",
      defaultRange: [peakWarmingSliderMin, peakWarmingSliderMax],
      value: parseRange(peakWarming as string | null),
      min: peakWarmingSliderMin,
      max: peakWarmingSliderMax,
      step: 0.1,
    },
  ];

  const setters: Record<string, (value: string | null) => Promise<URLSearchParams>> = {
    carbonRemoval: setCarbonRemoval,
    eocWarming: setEocWarming,
    peakWarming: setPeakWarming,
  };

  const handleApply = (selections: ChangeStateAction) => {
    Object.entries(selections).forEach(([key, value]) => {
      const setter = setters[key];
      const stringifierValue = value ? value.join(URL_VALUES_FILTER_SEPARATOR) : null;
      setter?.(stringifierValue);
    });
  };

  return {
    id,
    advancedFilterItems,
    handleApply,
    carbonRemovalSliderMin,
    carbonRemovalSliderMax,
    endOfCenturySliderMin,
    endOfCenturySliderMax,
    peakWarmingSliderMin,
    peakWarmingSliderMax,
  };
};
