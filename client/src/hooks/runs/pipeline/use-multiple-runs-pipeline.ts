"use client";

import { useMemo } from "react";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import useTopDataPointsFilter from "@/hooks/runs/filtering/use-top-data-points-filter";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { SingleRunPipelineParams, RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { generateExtendedRuns } from "@/hooks/runs/utils/utils";
import { filterRunsByMetaIndicators } from "@/hooks/runs/utils";
import useComputeEnergyShare from "@/hooks/runs/filtering/use-compute-energy-share";
import useComputeLandUse from "@/hooks/runs/filtering/use-compute-land-use";

export function useMultipleRunsPipeline({
  variable,
  prefix = "",
}: SingleRunPipelineParams): RunPipelineReturn {
  const { year, endYear, startYear, geography, climate, energy, land } =
    useScenarioDashboardUrlParams(prefix);

  const {
    dataPoints,
    isLoading: isLoadingDataPointsFiltering,
    isError: isErrorDataPointsFiltering,
  } = useTopDataPointsFilter({
    year,
    startYear,
    endYear,
    geography,
    variable,
  });

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
    climate,
    energy,
    land,
  });

  const isLoading =
    isLoadingDataPointsFiltering || isLoadingMeta || isEnergyShareLoading || isGfaLoading;
  const isError = isErrorDataPointsFiltering || isErrorMeta || isEnergyShareError || isGfaError;

  return {
    runs: filteredRuns,
    isError,
    isLoading,
  };
}
