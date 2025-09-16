import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import { LAND_FOREST_COVER } from "@/lib/config/filters/land-filter-config";
import { DataFrame } from "@iiasa/ixmp4-ts";
import { DataPoint } from "@/components/plots/types";
import { extractDataPoints } from "@/hooks/runs/filtering/utils";

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
  select: (data: DataFrame) => extractDataPoints(data),
});

const createDataMap = (data: DataPoint[]) =>
  new Map(data.map((point) => [point.runId, point.value]));

const calculatePercentageChanges = (data2020: DataPoint[], data2050: DataPoint[]) => {
  const results: Record<string, number> = {};
  const map2020 = createDataMap(data2020);
  const map2050 = createDataMap(data2050);
  const allRunIds = new Set([...map2020.keys(), ...map2050.keys()]);

  allRunIds.forEach((runId) => {
    const value2020 = map2020.get(runId);
    const value2050 = map2050.get(runId);

    if (value2020 && value2050 && value2020 !== 0) {
      results[runId.toString()] = (100 * value2050) / value2020 - 100;
    }
  });

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

  if (data2050?.length !== data2020?.length && data2050 && data2020) {
    console.error("Mismatched data lengths for land use computation");
    return { gfaIncreaseArray: {}, isLoading: false, isError: true };
  }

  const gfaIncreaseArray =
    data2020 && data2050 && !isLoading && !isError
      ? calculatePercentageChanges(data2020, data2050)
      : {};

  return { gfaIncreaseArray, isLoading, isError };
}
