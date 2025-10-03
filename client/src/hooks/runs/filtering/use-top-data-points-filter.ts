"use client";

import queryKeys from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { DataPointsFilterParams, getDataPointsFilter } from "@/hooks/runs/filtering/utils";
import { extractDataPoints } from "@/hooks/runs/utils/extract-data-points";

export default function useTopDataPointsFilter({
  geography,
  year,
  startYear,
  endYear,
  variable,
  runId,
}: DataPointsFilterParams) {
  const filter = getDataPointsFilter({ geography, year, startYear, endYear, variable });

  const queryKey = queryKeys.dataPoints.tabulate({
    ...(runId ? { run: { id: runId } } : {}),
    ...filter,
  });

  const { data, isLoading, isError } = useQuery({
    ...queryKey,
    enabled: !!geography,
    select: (data) => extractDataPoints(data),
  });

  return {
    dataPoints: data,
    isLoading,
    isError,
  };
}
