"use client";

import queryKeys from "@/lib/query-keys";
import { geographyOptions } from "@/lib/constants/geography-options";
import { useQuery } from "@tanstack/react-query";
import { extractDataPoints } from "@/components/plots/utils";

interface FilterParams {
  runId?: number | null;
  geography: string | null;
  year?: string | null;
  startYear: string | null;
  endYear: string | null;
  variable: string;
}

const getFilter = ({
  geography,
  year,
  startYear,
  endYear,
  variable,
}: Omit<FilterParams, "runId">) => {
  const baseFilter = {
    region: { name: geographyOptions.find((g) => g.value === geography)?.lookupName },
    variable: {
      name: variable,
    },
  };

  if (year) {
    return {
      ...baseFilter,
      stepYear: parseInt(year),
    };
  }

  if (startYear || endYear) {
    return {
      ...baseFilter,
      ...(startYear && { stepYear_gte: parseInt(startYear) }),
      ...(endYear && { stepYear_lte: parseInt(endYear) }),
    };
  }

  return baseFilter;
};

export default function useTopDataPointsFilter({
  geography,
  year,
  startYear,
  endYear,
  variable,
  runId,
}: FilterParams) {
  const filter = getFilter({ geography, year, startYear, endYear, variable });

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
