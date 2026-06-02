import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { carbonRemovalMaxAtom, carbonRemovalMinAtom } from "@/utils/atoms/carbon-removal-atoms";
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

  useEffect(() => {
    if (isError || isLoading || !metaIndicators?.length) return;

    let localMin = Infinity;
    let localMax = -Infinity;

    for (const indicator of metaIndicators) {
      if (indicator.key === EMISSIONS_DIAGNOSTICS_CUMULATIVE_CCS_2020_2100_Gt_CO2) {
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
