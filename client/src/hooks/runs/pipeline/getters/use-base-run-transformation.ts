import { useFilterUrlParams } from "@/hooks/nuqs/url-params/filter/use-filter-url-params";
import useComputeEnergyShare from "@/hooks/runs/filtering/use-compute-energy-share";
import useComputeLandUse from "@/hooks/runs/filtering/use-compute-land-use";
import { generateExtendedRuns } from "@/hooks/runs/utils/generate-extended-runs";
import { filterRunsByMetaIndicators } from "@/hooks/runs/utils/filtering";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { DataPoint } from "@/components/plots/types";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";

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
  });

  const isLoading = isLoadingMeta || isEnergyShareLoading || isGfaLoading;
  const isError = isErrorMeta || isEnergyShareError || isGfaError;

  return {
    runs: filteredRuns,
    isError,
    isLoading,
  };
}
