import {
  endOfCenturyWarmingMaxAtom,
  endOfCenturyWarmingMinAtom,
} from "@/utils/atoms/end-of-century-warming-atoms";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { CLIMATE_ASSESSMENT_WARMING_2100_MEDIAN } from "@/lib/config/filters/advanced-filters-config";
import { MetaIndicator } from "@/types/data/meta-indicator";

interface Props {
  isLoading: boolean;
  isError: boolean;
  metaIndicators: MetaIndicator[] | undefined;
}

export const useUpdateGlobalEndOfCenturyWarmingValues = ({
  isLoading,
  isError,
  metaIndicators,
}: Props) => {
  const setGlobalMin = useSetAtom(endOfCenturyWarmingMinAtom);
  const setGlobalMax = useSetAtom(endOfCenturyWarmingMaxAtom);

  useEffect(() => {
    if (isError || isLoading || !metaIndicators) return;

    let localMin = Number.MAX_SAFE_INTEGER;
    let localMax = Number.MIN_SAFE_INTEGER;

    for (const indicator of metaIndicators) {
      if (indicator.key === CLIMATE_ASSESSMENT_WARMING_2100_MEDIAN) {
        const v = parseFloat(indicator.value);
        if (v > localMax) localMax = v;
        if (v < localMin) localMin = v;
      }
    }

    if (localMin !== Number.MAX_SAFE_INTEGER) {
      setGlobalMin((prev) => (localMin < prev ? localMin : prev));
    }
    if (localMax !== Number.MIN_SAFE_INTEGER) {
      setGlobalMax((prev) => (localMax > prev ? localMax : prev));
    }
  }, [metaIndicators, isLoading, isError, setGlobalMin, setGlobalMax]);
};
