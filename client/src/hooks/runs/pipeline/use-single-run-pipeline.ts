"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { extractDataPoints } from "@/components/plots/utils";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { useMetaIndicatorsLookup } from "@/hooks/runs/lookup-tables/use-meta-indicators-lookup";
import { useDataPointsLookup } from "@/hooks/runs/lookup-tables/use-data-points-lookup";
import { useGenerateExtendedRuns } from "@/hooks/runs/pipeline/use-generate-extended-runs";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";

interface RunPipelineParams {
  runId: number;
  variable: VARIABLE_TYPE;
}

export function useSingleRunPipeline({ runId, variable }: RunPipelineParams): RunPipelineReturn {
  const { geography } = useScenarioDashboardUrlParams();

  const {
    data: dataPoints,
    isLoading: isDataPointsLoading,
    isError: isDataPointsError,
  } = useQuery({
    ...queryKeys.dataPoints.getForRun({
      runId: runId,
      variable: variable,
      geography: geography || "",
    }),
    select: (data) => extractDataPoints(data),
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

  const {
    data: runs = [],
    isLoading: isLoadingRuns,
    isError: isErrorRuns,
  } = useQuery({
    ...queryKeys.runs.details(runId),
  });

  const metaLookup = useMetaIndicatorsLookup(metaData);

  const dataPointsLookup = useDataPointsLookup(dataPoints);

  const extendedRuns = useGenerateExtendedRuns({
    runs,
    metaLookup,
    dataPointsLookup,
  });

  const isLoading = isDataPointsLoading || isLoadingMeta || isLoadingRuns;
  const isError = isDataPointsError || isErrorMeta || isErrorRuns;

  return useMemo(
    () => ({
      runs: extendedRuns,
      isError,
      isLoading,
    }),
    [extendedRuns, isError, isLoading],
  );
}
