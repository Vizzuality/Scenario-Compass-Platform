import { geographyConfig } from "@/lib/config/filters/geography-filter-config";
import { DataPointsFilterParams } from "@/types/data/data-point";

export const getDataPointsFilter = ({
  geography,
  year,
  startYear,
  endYear,
  variable,
}: Omit<DataPointsFilterParams, "runId" | "model" | "scenario">) => {
  const baseFilter = {
    region: { name: geographyConfig.find((g) => g.id === geography)?.name },
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
