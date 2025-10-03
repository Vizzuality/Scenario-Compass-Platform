import { generateExtendedRuns } from "@/hooks/runs/utils/generate-extended-runs";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { DataFrame } from "@iiasa/ixmp4-ts";
import { useQueries } from "@tanstack/react-query";
import { extractDataPoints } from "@/hooks/runs/utils/extract-data-points";
import { getDataPointsFilter } from "@/hooks/runs/filtering/utils";
import queryKeys from "@/lib/query-keys";
import {
  DataPointsQueriesReturn,
  MetaPointsQueriesReturn,
  RunPipelineReturn,
} from "@/hooks/runs/pipeline/types";
import useComputeEnergyShare from "@/hooks/runs/filtering/use-compute-energy-share";
import { filterRunsByMetaIndicators } from "@/hooks/runs/utils/filtering";
import useComputeLandUse from "@/hooks/runs/filtering/use-compute-land-use";
import { useBaseUrlParams } from "@/hooks/nuqs/url-params/base/use-base-url-params";
import { useFilterUrlParams } from "@/hooks/nuqs/url-params/filter/use-filter-url-params";

/**
 * A React hook that fetches and processes run data for multiple variables with optional filtering.
 *
 * This hook orchestrates a multi-step data pipeline:
 * 1. Fetches data points for each specified variable based on geography and time parameters
 * 2. Retrieves meta indicators for all unique runs found in the data points
 * 3. Enriches runs with computed energy shares and land use metrics
 * 4. Applies meta indicator filters (climate category, net zero year, renewables share, etc.)
 *
 * @param params - Configuration object for the pipeline
 * @param params.variablesNames - Array of variable names to fetch data for
 * @param params.runId - Optional run ID to filter data points to a specific run
 * @param params.prefix - Optional URL parameter prefix for reading namespaced query parameters
 *
 * @returns An object containing:
 * - `runs`: Array of filtered and extended run objects
 * - `isLoading`: Boolean indicating if any queries are still loading
 * - `isError`: Boolean indicating if any queries have errored
 *
 * @example
 * ```typescript
 * const { runs, isLoading, isError } = useCombineRunsForVariablesPipeline({
 *   variablesNames: ['Temperature|Global Mean', 'Emissions|CO2'],
 *   runId: 123,
 *   prefix: 'comparison'
 * });
 * ```
 *
 * @remarks
 * - Returns an empty array if geography is not specified in URL parameters
 * - Automatically deduplicates run IDs across multiple variable queries
 * - Matches data points with their corresponding meta indicators using run ID arrays
 */
export default function useCombineRunsForVariablesPipeline({
  prefix,
  runId,
  variablesNames = [],
}: {
  variablesNames: string[];
  runId?: number;
  prefix?: string;
}): RunPipelineReturn {
  const { year, endYear, startYear, geography } = useBaseUrlParams(prefix);
  const {
    climateCategory,
    yearNetZero,
    carbonRemoval,
    renewablesShare,
    biomassShare,
    gfaIncrease,
    fossilShare,
  } = useFilterUrlParams(prefix);

  const dataPointQueries: DataPointsQueriesReturn = useQueries({
    queries: variablesNames.map((variable) => {
      const filter = getDataPointsFilter({ geography, year, startYear, endYear, variable });
      const queryKey = {
        ...(runId ? { run: { id: runId } } : {}),
        ...filter,
      };

      return {
        ...queryKeys.dataPoints.tabulate({ ...queryKey }),
        enabled: !!geography,
        select: (data: DataFrame) => {
          const dataPoints = extractDataPoints(data);
          const uniqueIds = [...new Set(dataPoints.map((dp) => dp.runId))];
          return { dataPoints, uniqueIds, variable };
        },
      };
    }),
  });

  const metaQueries: MetaPointsQueriesReturn = useQueries({
    queries: dataPointQueries
      .filter((q) => q.isSuccess && q.data && q.data.uniqueIds.length > 0)
      .map((q) => {
        const uniqueIds = q.data!.uniqueIds;
        const filter = { run: { id_in: uniqueIds } };
        return {
          // @ts-expect-error No ts support
          ...queryKeys.metaIndicators.tabulate(filter),
          enabled: uniqueIds.length > 0,
          select: (data: DataFrame) => ({
            uniqueIds,
            metaPoints: getMetaPoints(data),
          }),
        };
      }),
  });

  const {
    energyShares,
    isLoading: isLoadingEnergyShares,
    isError: isErrorEnergyShares,
  } = useComputeEnergyShare();

  const { gfaIncreaseArray, isLoading: isGfaLoading, isError: isGfaError } = useComputeLandUse();

  const runs = () => {
    if (!geography) return [];

    const dataLoading = dataPointQueries.some((q) => q.isLoading);
    const metaLoading = metaQueries.some((q) => q.isLoading);

    if (dataLoading || metaLoading) return [];

    const successfulData = dataPointQueries.filter((q) => q.isSuccess && q.data);
    const successfulMeta = metaQueries.filter((q) => q.isSuccess && q.data);

    const extendedRuns = successfulData.map((dataQuery) => {
      const { dataPoints, uniqueIds } = dataQuery.data!;

      const metaQuery = successfulMeta.find(
        (m) => JSON.stringify(m.data!.uniqueIds.sort()) === JSON.stringify(uniqueIds.sort()),
      );

      if (!metaQuery) return [];

      const extendedRuns = generateExtendedRuns({
        energyShares,
        dataPoints,
        metaIndicators: metaQuery.data!.metaPoints,
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
      });
    });

    return extendedRuns.flat();
  };

  const isLoading =
    dataPointQueries.some((q) => q.isLoading) ||
    metaQueries.some((q) => q.isLoading) ||
    isGfaLoading ||
    isLoadingEnergyShares;
  const isError =
    dataPointQueries.some((q) => q.isError) ||
    metaQueries.some((q) => q.isError) ||
    isGfaError ||
    isErrorEnergyShares;

  return { runs: runs(), isLoading, isError };
}
