import { DataFrame } from "@iiasa/ixmp4-ts";
import { useQueries } from "@tanstack/react-query";
import { extractDataPoints } from "@/utils/data-manipulation/extract-data-points";
import { getDataPointsFilter } from "@/utils/filtering/data-points-filter";
import queryKeys from "@/lib/query-keys";
import { RunPipelineReturn } from "@/types/data/run";
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
    fossilFuelPhaseDown,
    mitigationStrategy,
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

  const queryConfigs = useMemo(
    () =>
      variablesNames.map((variable) => {
        const filter = getDataPointsFilter({
          geography,
          year,
          startYear,
          endYear,
          variable,
        });

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
    [variablesNames, geography, year, startYear, endYear, model, scenario],
  );

  const dataPointQueries = useQueries({
    queries: queryConfigs,
    combine: (results) => ({
      dataSets: results.flatMap((query) =>
        query.isSuccess && query.data ? [query.data.dataPoints] : [],
      ),
      isLoading: results.some((query) => query.isLoading),
      isError: results.some((query) => query.isError),
    }),
  });

  const { dataSets, isLoading: isDataLoading, isError: isDataError } = dataPointQueries;

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

  /**
   * Stage 1:
   * Expensive data transformation.
   *
   * This should NOT depend on UI filters.
   */
  const extendedRuns = useMemo(() => {
    if (!geography) return [];
    if (isDataLoading || isLoadingMeta || isLoadingEnergyShares || isGfaLoading) return [];
    if (!metaIndicators || !energyShares) return [];

    return dataSets.flatMap((dataPoints) => {
      return generateExtendedRuns({
        energyShares,
        dataPoints,
        metaIndicators,
        gfaIncreaseArray,
      });
    });
  }, [
    geography,
    isDataLoading,
    isLoadingMeta,
    isLoadingEnergyShares,
    isGfaLoading,
    metaIndicators,
    energyShares,
    gfaIncreaseArray,
    dataSets,
  ]);

  /**
   * Stage 2:
   * Cheap filter transformation.
   *
   * Filter changes should only rerun this block.
   */
  const filteredRuns = useMemo(
    () =>
      filterRunsByMetaIndicators({
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
        fossilFuelPhaseDown,
        mitigationStrategy,
      }),
    [
      extendedRuns,
      climateCategory,
      yearNetZero,
      carbonRemoval,
      renewablesShare,
      biomassShare,
      gfaIncrease,
      fossilShare,
      eocWarming,
      peakWarming,
      fossilFuelPhaseDown,
      mitigationStrategy,
    ],
  );

  const isLoading = isDataLoading || isLoadingMeta || isGfaLoading || isLoadingEnergyShares;

  const isError = isDataError || isErrorMeta || isGfaError || isErrorEnergyShares;

  return {
    runs: filteredRuns,
    isLoading,
    isError,
  };
}
