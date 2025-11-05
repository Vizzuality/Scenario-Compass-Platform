"use client";

import queryKeys from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getDataPointsFilter } from "@/utils/filtering/data-points-filter";
import { extractDataPoints } from "@/utils/data-manipulation/extract-data-points";
import { DataPointsFilterParams } from "@/types/data/data-point";

export default function useTopDataPointsFilter({
  geography,
  year,
  startYear,
  endYear,
  variable,
  model,
  scenario,
}: DataPointsFilterParams) {
  const filter = getDataPointsFilter({ geography, year, startYear, endYear, variable });

  const queryKey = queryKeys.dataPoints.tabulate({
    ...(model &&
      scenario && {
        model: {
          name: String(model),
        },
        scenario: {
          name: String(scenario),
        },
      }),
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
