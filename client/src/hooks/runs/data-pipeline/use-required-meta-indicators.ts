import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DataFrame } from "@iiasa/ixmp4-ts";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/utils/data-manipulation/get-meta-points";
import { REQUIRED_META_KEYS } from "@/lib/config/filters/required-meta-keys";
import { MetaIndicator } from "@/types/data/meta-indicator";
import { useUpdateGlobalCarbonRemovalValues } from "@/hooks/jotai/use-update-global-carbon-removal-values";
import { useUpdateGlobalEndOfCenturyWarmingValues } from "@/hooks/jotai/use-update-global-end-of-century-warming-values";
import { useUpdateGlobalPeakWarmingValues } from "@/hooks/jotai/use-update-global-peak-warming-values";

interface UseMetaIndicatorsReturn {
  metaIndicators: MetaIndicator[];
  isLoading: boolean;
  isError: boolean;
}

export default function useRequiredMetaIndicators(): UseMetaIndicatorsReturn {
  const {
    data: requiredMetaData,
    isLoading: isLoadingRequiredMeta,
    isError: isErrorRequiredMeta,
  } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      // @ts-expect-error No ts support
      key_in: [...REQUIRED_META_KEYS],
    }),
    staleTime: 5 * 60 * 1000,
    select: (data: DataFrame) => getMetaPoints(data),
  });

  const {
    data: concernMetaData,
    isLoading: isLoadingConcernMeta,
    isError: isErrorConcernMeta,
  } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      // @ts-expect-error No ts support
      key_like: "*Concern|*",
    }),
    staleTime: 5 * 60 * 1000,
    select: (data: DataFrame) => getMetaPoints(data),
  });

  const metaIndicators = useMemo(() => {
    return [...(requiredMetaData ?? []), ...(concernMetaData ?? [])];
  }, [requiredMetaData, concernMetaData]);

  const isLoading = isLoadingRequiredMeta || isLoadingConcernMeta;
  const isError = isErrorRequiredMeta || isErrorConcernMeta;

  useUpdateGlobalCarbonRemovalValues({
    isLoading,
    isError,
    metaIndicators,
  });

  useUpdateGlobalEndOfCenturyWarmingValues({
    isLoading,
    isError,
    metaIndicators,
  });

  useUpdateGlobalPeakWarmingValues({
    isLoading,
    isError,
    metaIndicators,
  });

  return {
    metaIndicators,
    isLoading,
    isError,
  };
}
