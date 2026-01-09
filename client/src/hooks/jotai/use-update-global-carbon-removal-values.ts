import { carbonRemovalMaxAtom, carbonRemovalMinAtom } from "@/utils/atoms/carbon-removal-atoms";
import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { EMISSIONS_DIAGNOSTICS_CUMULATIVE_CCS_2020_2100_Gt_CO2 } from "@/lib/config/filters/advanced-filters-config";
import { MetaIndicator } from "@/types/data/meta-indicator";

interface Props {
  isLoading: boolean;
  isError: boolean;
  metaIndicators: MetaIndicator[] | undefined;
}

export const useUpdateGlobalCarbonRemovalValues = ({
  isLoading,
  isError,
  metaIndicators,
}: Props) => {
  const setGlobalMin = useSetAtom(carbonRemovalMinAtom);
  const setGlobalMax = useSetAtom(carbonRemovalMaxAtom);
  const currentGlobalMin = useAtomValue(carbonRemovalMinAtom);
  const currentGlobalMax = useAtomValue(carbonRemovalMaxAtom);

  if (isError || isLoading || !metaIndicators) return;

  let localMinCarbonRemoval = Number.MAX_SAFE_INTEGER;
  let localMaxCarbonRemoval = Number.MIN_SAFE_INTEGER;

  metaIndicators.forEach((indicator) => {
    if (indicator.key === EMISSIONS_DIAGNOSTICS_CUMULATIVE_CCS_2020_2100_Gt_CO2) {
      const carbonRemovalValue = parseFloat(indicator.value);
      if (carbonRemovalValue > localMaxCarbonRemoval) {
        localMaxCarbonRemoval = carbonRemovalValue;
      }
      if (carbonRemovalValue < localMinCarbonRemoval) {
        localMinCarbonRemoval = carbonRemovalValue;
      }
    }
  });

  if (localMinCarbonRemoval < currentGlobalMin) {
    setGlobalMin(localMinCarbonRemoval);
  }
  if (localMaxCarbonRemoval > currentGlobalMax) {
    setGlobalMax(localMaxCarbonRemoval);
  }
};
