import { useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  endOfCenturyWarmingMaxAtom,
  endOfCenturyWarmingMinAtom,
} from "@/utils/atoms/end-of-century-warming-atoms";
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
    if (isError || isLoading || !metaIndicators?.length) return;

    let localMin = Infinity;
    let localMax = -Infinity;

    for (const indicator of metaIndicators) {
      if (indicator.key === CLIMATE_ASSESSMENT_WARMING_2100_MEDIAN) {
        const value = parseFloat(indicator.value);
        if (!isNaN(value)) {
          if (value < localMin) localMin = value;
          if (value > localMax) localMax = value;
        }
      }
    }

    if (localMin !== Infinity) setGlobalMin(localMin);
    if (localMax !== -Infinity) setGlobalMax(localMax);
  }, [isLoading, isError, metaIndicators, setGlobalMin, setGlobalMax]);
};
