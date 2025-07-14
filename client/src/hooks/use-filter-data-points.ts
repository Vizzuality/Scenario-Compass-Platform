"use client";

import queryKeys from "@/lib/query-keys";
import { geographyOptions } from "@/lib/constants/geography-options";
import { useQuery } from "@tanstack/react-query";
import { useScenarioDashboardUrlParams } from "@/containers/scenario-dashboard/utils/url-store";
import { extractDataPoints } from "@/components/plots/utils/utils";

interface FilterParams {
  geography: string | null;
  year: string | null;
  startYear: string | null;
  endYear: string | null;
  variable: string;
}

const getFilter = ({ geography, year, startYear, endYear, variable }: FilterParams) => {
  const baseFilter = {
    region: { name: geographyOptions.find((g) => g.value === geography)?.lookupName },
    variable: {
      name: variable,
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

interface Props {
  variable: string;
}

export default function useFilterDataPoints({ variable }: Props) {
  const { geography, year, startYear, endYear } = useScenarioDashboardUrlParams();

  const filter = getFilter({ geography, year, startYear, endYear, variable });

  const { data, isLoading, isError } = useQuery({
    ...queryKeys.dataPoints.tabulate(filter),
    enabled: !!geography,
  });

  const dataPoints = extractDataPoints(data);

  return {
    dataPoints,
    isLoading,
    isError,
    geography,
    year,
    startYear,
    endYear,
  };
}
