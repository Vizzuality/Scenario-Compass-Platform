import { carbonRemovalMaxAtom, carbonRemovalMinAtom } from "@/utils/atoms/carbon-removal-atoms";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
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
    if (isError || isLoading || !metaIndicators) return;

    let localMin = Number.MAX_SAFE_INTEGER;
    let localMax = Number.MIN_SAFE_INTEGER;

    for (const indicator of metaIndicators) {
      if (indicator.key === EMISSIONS_DIAGNOSTICS_CUMULATIVE_CCS_2020_2100_Gt_CO2) {
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
