import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { peakWarmingMaxAtom, peakWarmingMinAtom } from "@/utils/atoms/peak-warming-atoms";
import { CLIMATE_ASSESSMENT_PEAK_WARMING_MEDIAN } from "@/lib/config/filters/advanced-filters-config";
import { MetaIndicator } from "@/types/data/meta-indicator";

interface Props {
  isLoading: boolean;
  isError: boolean;
  metaIndicators: MetaIndicator[] | undefined;
}

export const useUpdateGlobalPeakWarmingValues = ({ isLoading, isError, metaIndicators }: Props) => {
  const setGlobalMin = useSetAtom(peakWarmingMinAtom);
  const setGlobalMax = useSetAtom(peakWarmingMaxAtom);

  useEffect(() => {
    if (isError || isLoading || !metaIndicators?.length) return;

    let localMin = Infinity;
    let localMax = -Infinity;

    for (const indicator of metaIndicators) {
      if (indicator.key === CLIMATE_ASSESSMENT_PEAK_WARMING_MEDIAN) {
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
