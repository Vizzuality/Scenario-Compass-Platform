import { generateExtendedRuns } from "@/hooks/runs/pipeline/utils";
import { getMetaPoints } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { DataFrame } from "@iiasa/ixmp4-ts";
import { useQueries } from "@tanstack/react-query";
import { extractDataPoints, getDataPointsFilter } from "@/hooks/runs/filtering/utils";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import queryKeys from "@/lib/query-keys";
import {
  DataPointsQueriesReturn,
  MetaPointsQueriesReturn,
  RunPipelineReturn,
} from "@/hooks/runs/pipeline/types";
import useComputeEnergyShare from "@/hooks/runs/filtering/use-compute-energy-share";
import { filterRunsByMetaIndicators } from "@/hooks/runs/utils/filtering";
import useComputeLandUse from "@/hooks/runs/filtering/use-compute-land-use";

export default function useSyncRunsPipeline({
  prefix,
  runId,
  variablesNames = [],
}: {
  variablesNames: string[];
  runId?: number;
  prefix?: string;
}): RunPipelineReturn {
  const { year, endYear, startYear, geography, climate, energy, land } =
    useScenarioDashboardUrlParams(prefix);

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
        climate,
        energy,
        land,
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
