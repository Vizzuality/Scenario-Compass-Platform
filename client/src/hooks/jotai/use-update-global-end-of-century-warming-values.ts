import {
  endOfCenturyWarmingMaxAtom,
  endOfCenturyWarmingMinAtom,
} from "@/utils/atoms/end-of-century-warming-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { MetaIndicator } from "@/types/data/meta-indicator";
import { CLIMATE_ASSESSMENT_WARMING_2100_MEDIAN } from "@/lib/config/filters/advanced-filters-config";

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
  const currentGlobalMin = useAtomValue(endOfCenturyWarmingMinAtom);
  const currentGlobalMax = useAtomValue(endOfCenturyWarmingMaxAtom);

  if (isError || isLoading || !metaIndicators) return;

  let localMin = Number.MAX_SAFE_INTEGER;
  let localMax = Number.MIN_SAFE_INTEGER;

  metaIndicators.forEach((indicator) => {
    if (indicator.key === CLIMATE_ASSESSMENT_WARMING_2100_MEDIAN) {
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
