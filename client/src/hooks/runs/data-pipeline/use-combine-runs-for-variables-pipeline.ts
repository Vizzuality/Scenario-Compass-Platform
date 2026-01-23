import { DataFrame } from "@iiasa/ixmp4-ts";
import { useQueries } from "@tanstack/react-query";
import { extractDataPoints } from "@/utils/data-manipulation/extract-data-points";
import { getDataPointsFilter } from "@/utils/filtering/data-points-filter";
import queryKeys from "@/lib/query-keys";
import { DataPointsQueriesReturn, RunPipelineReturn } from "@/types/data/run";
import useComputeEnergyShare from "@/hooks/runs/filtering/use-compute-energy-share";
import { filterRunsByMetaIndicators } from "@/utils/filtering";
import useComputeLandUse from "@/hooks/runs/filtering/use-compute-land-use";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/use-base-url-params";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/use-filter-url-params";
import { generateExtendedRuns } from "@/utils/data-manipulation/generate-extended-runs";
import { useMemo } from "react";
import useRequiredMetaIndicators from "@/hooks/runs/data-pipeline/use-required-meta-indicators";

export default function useCombineRunsForVariablesPipeline({
  prefix,
  variablesNames = [],
}: {
  variablesNames: string[];
  prefix?: string;
}): RunPipelineReturn {
  const { year, endYear, startYear, geography, model, scenario } = useBaseUrlParams({ prefix });
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

  const dataPointQueries: DataPointsQueriesReturn = useQueries({
    queries: variablesNames.map((variable) => {
      const filter = getDataPointsFilter({ geography, year, startYear, endYear, variable });

      return {
        ...queryKeys.dataPoints.tabulate({
          ...filter,
          ...(model &&
            scenario && {
              model: { name: String(model) },
              scenario: { name: String(scenario) },
            }),
        }),
        enabled: !!geography,
        select: (data: DataFrame) => ({
          dataPoints: extractDataPoints(data),
          variable,
        }),
      };
    }),
  });

  const {
    metaIndicators,
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
  } = useRequiredMetaIndicators();

  const {
    energyShares,
    isLoading: isLoadingEnergyShares,
    isError: isErrorEnergyShares,
  } = useComputeEnergyShare();

  const { gfaIncreaseArray, isLoading: isGfaLoading, isError: isGfaError } = useComputeLandUse();

  const runs = useMemo(() => {
    if (!geography) return [];

    const dataLoading = dataPointQueries.some((q) => q.isLoading);
    if (dataLoading || isLoadingMeta) return [];

    const successfulData = dataPointQueries.filter((q) => q.isSuccess && q.data);

    return successfulData.flatMap((dataQuery) => {
      const { dataPoints } = dataQuery.data!;

      const extendedRuns = generateExtendedRuns({
        energyShares,
        dataPoints,
        metaIndicators,
        gfaIncreaseArray,
      });

      return filterRunsByMetaIndicators({
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
    });
  }, [
    geography,
    dataPointQueries,
    isLoadingMeta,
    metaIndicators,
    energyShares,
    gfaIncreaseArray,
    climateCategory,
    yearNetZero,
    carbonRemoval,
    renewablesShare,
    biomassShare,
    gfaIncrease,
    fossilShare,
    eocWarming,
    peakWarming,
  ]);

  const isLoading =
    dataPointQueries.some((q) => q.isLoading) ||
    isLoadingMeta ||
    isGfaLoading ||
    isLoadingEnergyShares;

  const isError =
    dataPointQueries.some((q) => q.isError) || isErrorMeta || isGfaError || isErrorEnergyShares;

  return { runs, isLoading, isError };
}
