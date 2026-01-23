import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import queryKeys from "@/lib/query-keys";
import { LAND_FOREST_COVER } from "@/lib/config/filters/land-filter-config";
import { DataFrame } from "@iiasa/ixmp4-ts";
import { DataPoint } from "@/types/data/data-point";
import { extractDataPoints } from "@/utils/data-manipulation/extract-data-points";

interface Result {
  gfaIncreaseArray: Record<string, number>;
  isLoading: boolean;
  isError: boolean;
}

const fetchForestData = (stepYear: number) => ({
  ...queryKeys.dataPoints.tabulate({
    variable: { name: LAND_FOREST_COVER },
    stepYear,
  }),
  staleTime: 5 * 60 * 1000,
  select: (data: DataFrame) => extractDataPoints(data),
});

const calculatePercentageChanges = (data2020: DataPoint[], data2050: DataPoint[]) => {
  const results: Record<string, number> = {};
  const map2020 = new Map(data2020.map((point) => [point.runId, point.value]));

  for (const point2050 of data2050) {
    const value2020 = map2020.get(point2050.runId);

    if (value2020 && value2020 !== 0) {
      results[point2050.runId] = (100 * point2050.value) / value2020 - 100;
    }
  }

  return results;
};

export default function useComputeLandUse(): Result {
  const {
    data: data2050,
    isLoading: loading2050,
    isError: error2050,
  } = useQuery(fetchForestData(2050));

  const {
    data: data2020,
    isLoading: loading2020,
    isError: error2020,
  } = useQuery(fetchForestData(2020));

  const isLoading = loading2050 || loading2020;
  const isError = error2050 || error2020;

  const gfaIncreaseArray = useMemo(() => {
    if (!data2020 || !data2050 || isLoading || isError) {
      return {};
    }

    if (data2050.length !== data2020.length) {
      console.warn(
        `Mismatched data lengths for land use: 2020 has ${data2020.length}, 2050 has ${data2050.length} data points`,
      );
    }

    return calculatePercentageChanges(data2020, data2050);
  }, [data2020, data2050, isLoading, isError]);

  return { gfaIncreaseArray, isLoading, isError };
}
