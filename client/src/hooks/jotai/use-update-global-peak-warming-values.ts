import { peakWarmingMaxAtom, peakWarmingMinAtom } from "@/utils/atoms/peak-warming-atoms";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
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
    if (isError || isLoading || !metaIndicators) return;

    let localMin = Number.MAX_SAFE_INTEGER;
    let localMax = Number.MIN_SAFE_INTEGER;

    for (const indicator of metaIndicators) {
      if (indicator.key === CLIMATE_ASSESSMENT_PEAK_WARMING_MEDIAN) {
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
