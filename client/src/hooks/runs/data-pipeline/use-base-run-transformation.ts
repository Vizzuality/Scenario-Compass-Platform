import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import useComputeEnergyShare from "@/hooks/runs/filtering/use-compute-energy-share";
import useComputeLandUse from "@/hooks/runs/filtering/use-compute-land-use";
import { generateExtendedRuns } from "@/utils/data-manipulation/generate-extended-runs";
import { filterRunsByMetaIndicators } from "@/utils/filtering";
import { getMetaPoints } from "@/utils/data-manipulation/get-meta-points";
import { RunPipelineReturn } from "@/types/data/run";
import { DataPoint } from "@/types/data/data-point";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { useUpdateGlobalCarbonRemovalValues } from "@/hooks/jotai/use-update-global-carbon-removal-values";
import { useUpdateGlobalEndOfCenturyWarmingValues } from "@/hooks/jotai/use-update-global-end-of-century-warming-values";
import { useUpdateGlobalPeakWarmingValues } from "@/hooks/jotai/use-update-global-peak-warming-values";

export default function useBaseRunTransformation({
  dataPoints,
  prefix = "",
}: {
  dataPoints: [] | DataPoint[] | undefined;
  prefix?: string;
}): RunPipelineReturn {
  const {
    climateCategory,
    yearNetZero,
    carbonRemoval,
    renewablesShare,
    biomassShare,
    gfaIncrease,
    fossilShare,
    eocWarming,
    peakWarming,
  } = useFilterUrlParams(prefix);

  const {
    energyShares,
    isLoading: isEnergyShareLoading,
    isError: isEnergyShareError,
  } = useComputeEnergyShare();

  const { gfaIncreaseArray, isLoading: isGfaLoading, isError: isGfaError } = useComputeLandUse();

  const uniqueRunIds = useMemo(() => {
    if (!dataPoints?.length) return [];
    return [...new Set(dataPoints.map((dp) => dp.runId))];
  }, [dataPoints]);

  const {
    data: metaData,
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
  } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      run: {
        // @ts-expect-error limited TypeScript support for this query
        id_in: uniqueRunIds,
      },
    }),
    enabled: uniqueRunIds.length > 0,
    select: (data) => getMetaPoints(data),
  });

  useUpdateGlobalCarbonRemovalValues({
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
    metaIndicators: metaData,
  });
  useUpdateGlobalEndOfCenturyWarmingValues({
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
    metaIndicators: metaData,
  });
  useUpdateGlobalPeakWarmingValues({
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
    metaIndicators: metaData,
  });

  const extendedRuns = generateExtendedRuns({
    dataPoints: dataPoints || [],
    metaIndicators: metaData || [],
    energyShares,
    gfaIncreaseArray,
  });

  const filteredRuns = filterRunsByMetaIndicators({
    runs: extendedRuns,
    climateCategory,
    yearNetZero,
    carbonRemoval,
    renewablesShare,
    biomassShare,
    gfaIncrease,
    fossilShare,
    eocWarming,
    peakWarming,
  });

  const isLoading = isLoadingMeta || isEnergyShareLoading || isGfaLoading;
  const isError = isErrorMeta || isEnergyShareError || isGfaError;

  return {
    runs: filteredRuns,
    isError,
    isLoading,
  };
}
