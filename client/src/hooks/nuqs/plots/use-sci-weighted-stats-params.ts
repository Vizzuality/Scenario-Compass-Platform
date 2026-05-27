import { parseAsBoolean, useQueryState } from "nuqs";

export const SCI_WEIGHTED_MEDIAN_PARAM = "sciWeightedMedian";
export const SCI_WEIGHTED_PERCENTILES_PARAM = "sciWeightedPercentiles";

export const useSciWeightedStatsParams = () => {
  const [showSciWeightedMedian, setShowSciWeightedMedian] = useQueryState(
    SCI_WEIGHTED_MEDIAN_PARAM,
    parseAsBoolean.withDefault(false),
  );
  const [showSciWeightedPercentiles, setShowSciWeightedPercentiles] = useQueryState(
    SCI_WEIGHTED_PERCENTILES_PARAM,
    parseAsBoolean.withDefault(false),
  );

  return {
    showSciWeightedMedian,
    setShowSciWeightedMedian,
    showSciWeightedPercentiles,
    setShowSciWeightedPercentiles,
  };
};
