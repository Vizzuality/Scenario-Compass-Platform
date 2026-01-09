import { peakWarmingMaxAtom, peakWarmingMinAtom } from "@/utils/atoms/peak-warming-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { MetaIndicator } from "@/types/data/meta-indicator";
import { CLIMATE_ASSESSMENT_PEAK_WARMING_MEDIAN } from "@/lib/config/filters/advanced-filters-config";

interface Props {
  isLoading: boolean;
  isError: boolean;
  metaIndicators: MetaIndicator[] | undefined;
}

export const useUpdateGlobalPeakWarmingValues = ({ isLoading, isError, metaIndicators }: Props) => {
  const setGlobalMin = useSetAtom(peakWarmingMinAtom);
  const setGlobalMax = useSetAtom(peakWarmingMaxAtom);
  const currentGlobalMin = useAtomValue(peakWarmingMinAtom);
  const currentGlobalMax = useAtomValue(peakWarmingMaxAtom);

  if (isError || isLoading || !metaIndicators) return;

  let localMin = Number.MAX_SAFE_INTEGER;
  let localMax = Number.MIN_SAFE_INTEGER;

  metaIndicators.forEach((indicator) => {
    if (indicator.key === CLIMATE_ASSESSMENT_PEAK_WARMING_MEDIAN) {
      const value = parseFloat(indicator.value);
      if (value > localMax) {
        localMax = value;
      }
      if (value < localMin) {
        localMin = value;
      }
    }
  });

  if (localMin < currentGlobalMin) {
    setGlobalMin(localMin);
  }
  if (localMax > currentGlobalMax) {
    setGlobalMax(localMax);
  }
};
