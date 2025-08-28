"use client";

import { useMemo } from "react";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import useTopDataPointsFilter from "@/hooks/runs/filtering/use-top-data-points-filter";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useFilterRunsByMetaIndicators } from "@/hooks/runs/filtering/use-filter-runs-by-meta-indicators";
import { useGenerateExtendedRuns } from "@/hooks/runs/pipeline/use-generate-extended-runs";
import { SingleRunPipelineParams, RunPipelineReturn } from "@/hooks/runs/pipeline/types";

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
        // @ts-expect-error lack of TypeScript support for this query
        id_in: uniqueRunIds,
      },
    }),
    enabled: uniqueRunIds.length > 0,
    select: (data) => getMetaPoints(data),
  });

  const extendedRuns = useGenerateExtendedRuns({
    dataPoints: dataPoints || [],
    metaIndicators: metaData || [],
  });

  const filteredRuns = useFilterRunsByMetaIndicators({
    runs: extendedRuns,
    climate,
    energy,
    land,
  });

  const isLoading = isLoadingDataPointsFiltering || isLoadingMeta;
  const isError = isErrorDataPointsFiltering || isErrorMeta;

  return useMemo(
    () => ({
      runs: filteredRuns,
      isError,
      isLoading,
    }),
    [filteredRuns, isError, isLoading],
  );
}
