"use client";

import queryKeys from "@/lib/query-keys";
import { geographyOptions } from "@/lib/constants/geography-options";
import { VARIABLES_OPTIONS } from "@/lib/constants/variables-options";
import { useQuery } from "@tanstack/react-query";

interface FilterParams {
  geography: string | null;
  year: string | null;
  startYear: string | null;
  endYear: string | null;
}

const getFilter = ({ geography, year, startYear, endYear }: FilterParams) => {
  const baseFilter = {
    region: { name: geographyOptions.find((g) => g.value === geography)?.label },
    variable: {
      name: VARIABLES_OPTIONS[0],
    },
  };

  if (year && !startYear && !endYear) {
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

export default function useFilterDataPoints({ geography, year, startYear, endYear }: FilterParams) {
  const filter = getFilter({ geography, year, startYear, endYear });

  const { data, isLoading, isError } = useQuery({
    ...queryKeys.dataPoints.tabulate(filter),
    enabled: !!geography,
  });

  return {
    data,
    isLoading,
    isError,
    geography,
    year,
    startYear,
    endYear,
  };
}
