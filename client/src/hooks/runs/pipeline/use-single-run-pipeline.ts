"use client";

import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import useTopDataPointsFilter from "@/hooks/runs/filtering/use-top-data-points-filter";
import { generateExtendedRuns } from "@/hooks/runs/pipeline/utils";

interface RunPipelineParams {
  runId: number;
  variable: string;
}

export function useSingleRunPipeline({ runId, variable }: RunPipelineParams): RunPipelineReturn {
  const { geography, startYear, endYear } = useScenarioDashboardUrlParams();

  const {
    dataPoints,
    isLoading: isDataPointsLoading,
    isError: isDataPointsError,
  } = useTopDataPointsFilter({
    startYear,
    endYear,
    geography,
    variable,
    runId,
  });

  const {
    data: metaData,
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
  } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      run: {
        id: runId,
      },
    }),
    select: (data) => getMetaPoints(data),
  });

  const extendedRuns = generateExtendedRuns({
    dataPoints: dataPoints || [],
    metaIndicators: metaData || [],
  });

  const isLoading = isDataPointsLoading || isLoadingMeta;
  const isError = isDataPointsError || isErrorMeta;

  return {
    runs: extendedRuns,
    isError,
    isLoading,
  };
}
