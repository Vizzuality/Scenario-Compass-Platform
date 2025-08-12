"use client";

import { useMemo } from "react";
import { useScenarioDashboardUrlParams } from "@/hooks/nuqs/use-scenario-dashboard-url-params";
import useTopDataPointsFilter from "@/hooks/runs/filtering/use-top-data-points-filter";
import { DataPoint } from "@/components/plots/types";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import {
  getMetaPoints,
  MetaIndicator,
} from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useFilterRunsByMetaIndicators } from "@/hooks/runs/filtering/use-filter-runs-by-meta-indicators";
import { useMetaIndicatorsLookup } from "@/hooks/runs/lookup-tables/use-meta-indicators-lookup";
import { useDataPointsLookup } from "@/hooks/runs/lookup-tables/use-data-points-lookup";
import { useGenerateExtendedRuns } from "@/hooks/runs/pipeline/use-generate-extended-runs";
import { Model, Scenario } from "@iiasa/ixmp4-ts";
import { CategoryKey } from "@/containers/scenario-dashboard/utils/category-config";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";

export type ShortDataPoint = Pick<DataPoint, "year" | "value">;
export type ShortMetaIndicator = Pick<MetaIndicator, "key" | "value">;
export type ShortScenario = Pick<Scenario, "id" | "name">;
export type ShortModel = Pick<Model, "id" | "name">;

export interface ExtendedRun {
  id: number;
  scenario: ShortScenario;
  model: ShortModel;
  points: ShortDataPoint[];
  flagCategory: CategoryKey;
  metaIndicators: ShortMetaIndicator[];
}

export interface RunPipelineReturn {
  runs: ExtendedRun[];
  isLoading: boolean;
  isError: boolean;
}

interface RunPipelineParams {
  variable: VARIABLE_TYPE;
  prefix?: string;
}

export function useMultipleRunsPipeline({
  variable,
  prefix = "",
}: RunPipelineParams): RunPipelineReturn {
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

  const {
    data: runs = [],
    isLoading: isLoadingRuns,
    isError: isErrorRuns,
  } = useQuery({
    ...queryKeys.runs.list({
      iamc: {
        variable: {
          name: variable,
        },
        region: {
          id: Number(geography),
        },
      },
    }),
  });

  const uniqueRunIds = useMemo(() => {
    if (!runs?.length) return [];
    return [...new Set(runs.map((run) => run.id))];
  }, [runs]);

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

  const metaLookup = useMetaIndicatorsLookup(metaData);

  const dataPointsLookup = useDataPointsLookup(dataPoints);

  const extendedRuns = useGenerateExtendedRuns({
    runs,
    metaLookup,
    dataPointsLookup,
  });

  const filteredRuns = useFilterRunsByMetaIndicators({
    runs: extendedRuns,
    climate,
    energy,
    land,
  });

  const isLoading = isLoadingDataPointsFiltering || isLoadingRuns || isLoadingMeta;
  const isError = isErrorDataPointsFiltering || isErrorRuns || isErrorMeta;

  return useMemo(
    () => ({
      runs: filteredRuns,
      isError,
      isLoading,
    }),
    [filteredRuns, isError, isLoading],
  );
}
