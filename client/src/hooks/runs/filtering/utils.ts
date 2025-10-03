import { geographyConfig } from "@/lib/config/filters/geography-filter-config";

export interface DataPointsFilterParams {
  runId?: number | null;
  geography: string | null;
  year?: string | null;
  startYear: string | null;
  endYear: string | null;
  variable: string;
}

export const getDataPointsFilter = ({
  geography,
  year,
  startYear,
  endYear,
  variable,
}: Omit<DataPointsFilterParams, "runId">) => {
  const baseFilter = {
    region: { name: geographyConfig.find((g) => g.value === geography)?.lookupName },
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
