import { parseAsBoolean, useQueryStates } from "nuqs";
import { useMemo } from "react";
import { getParamName } from "@/utils/url-params-utils";

export const SCI_WEIGHTED_MEDIAN_PARAM = "sciWeightedMedian";
export const SCI_WEIGHTED_PERCENTILES_PARAM = "sciWeightedPercentiles";

export const useSciWeightedStatsParams = ({ prefix = "" }: { prefix?: string } = {}) => {
  const params = useMemo(
    () => ({
      sciWeightedMedian: getParamName(SCI_WEIGHTED_MEDIAN_PARAM, prefix),
      sciWeightedPercentiles: getParamName(SCI_WEIGHTED_PERCENTILES_PARAM, prefix),
    }),
    [prefix],
  );

  const queryConfig = useMemo(
    () => ({
      [params.sciWeightedMedian]: parseAsBoolean.withDefault(false),
      [params.sciWeightedPercentiles]: parseAsBoolean.withDefault(false),
    }),
    [params],
  );

  const [filters, setFilters] = useQueryStates(queryConfig);

  return {
    showSciWeightedMedian: filters[params.sciWeightedMedian],
    setShowSciWeightedMedian: (value: boolean | null) =>
      setFilters({ [params.sciWeightedMedian]: value }),
    showSciWeightedPercentiles: filters[params.sciWeightedPercentiles],
    setShowSciWeightedPercentiles: (value: boolean | null) =>
      setFilters({ [params.sciWeightedPercentiles]: value }),
  };
};
