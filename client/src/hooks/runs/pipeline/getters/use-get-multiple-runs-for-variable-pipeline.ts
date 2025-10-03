"use client";

import useTopDataPointsFilter from "@/hooks/runs/filtering/use-top-data-points-filter";
import { SingleRunPipelineParams, RunPipelineReturn } from "@/hooks/runs/pipeline/types";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";
import useBaseRunTransformation from "@/hooks/runs/pipeline/getters/use-base-run-transformation";

export function useGetMultipleRunsForVariablePipeline({
  variable,
  prefix = "",
}: SingleRunPipelineParams): RunPipelineReturn {
  const { year, endYear, startYear, geography } = useBaseUrlParams(prefix);
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
    runs: filteredRuns,
    isError,
    isLoading,
  } = useBaseRunTransformation({ dataPoints, prefix });

  return {
    runs: filteredRuns,
    isError: isError || isErrorDataPointsFiltering,
    isLoading: isLoading || isLoadingDataPointsFiltering,
  };
}
