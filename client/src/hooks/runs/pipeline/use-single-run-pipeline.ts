"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useGenerateExtendedRuns } from "@/hooks/runs/pipeline/use-generate-extended-runs";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import useTopDataPointsFilter from "@/hooks/runs/filtering/use-top-data-points-filter";

interface RunPipelineParams {
  runId: number;
  variable: VARIABLE_TYPE;
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

  const extendedRuns = useGenerateExtendedRuns({
    dataPoints: dataPoints || [],
    metaIndicators: metaData || [],
  });

  const isLoading = isDataPointsLoading || isLoadingMeta;
  const isError = isDataPointsError || isErrorMeta;

  return useMemo(
    () => ({
      runs: extendedRuns,
      isError,
      isLoading,
    }),
    [extendedRuns, isError, isLoading],
  );
}
