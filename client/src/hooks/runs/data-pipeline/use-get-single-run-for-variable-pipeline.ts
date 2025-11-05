"use client";

import useTopDataPointsFilter from "@/hooks/runs/filtering/use-top-data-points-filter";
import { RunPipelineReturn } from "@/types/data/run";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import useBaseRunTransformation from "@/hooks/runs/data-pipeline/use-base-run-transformation";

interface SingleRunPipelineParams {
  variable: string;
}

export function useGetSingleRunForVariablePipeline({
  variable,
}: SingleRunPipelineParams): RunPipelineReturn {
  const { year, endYear, startYear, geography, model, scenario } = useBaseUrlParams();

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
    model,
    scenario,
  });

  const { runs: filteredRuns, isError, isLoading } = useBaseRunTransformation({ dataPoints });

  return {
    runs: filteredRuns,
    isError: isError || isErrorDataPointsFiltering,
    isLoading: isLoading || isLoadingDataPointsFiltering,
  };
}
