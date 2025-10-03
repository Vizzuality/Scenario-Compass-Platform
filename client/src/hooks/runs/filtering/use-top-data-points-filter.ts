"use client";

import queryKeys from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getDataPointsFilter } from "@/hooks/runs/filtering/utils";
import { extractDataPoints } from "@/hooks/runs/utils/extract-data-points";
import { DataPointsFilterParams } from "@/hooks/runs/filtering/types";

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
