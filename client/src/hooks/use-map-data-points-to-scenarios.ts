import { useQuery } from "@tanstack/react-query";
import queryKeys from "@/lib/query-keys";
import {
  getMetaPoints,
  MetaPoint,
} from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { useMemo } from "react";
import { DataPoint, MetaDataPoint } from "@/components/plots/types/plots";

interface Props {
  dataPoints?: DataPoint[];
}

interface ReturnType {
  metaDataPoints: MetaDataPoint[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook that enriches data points with their associated meta indicator information.
 *
 * This hook takes an array of data points and enhances each one with corresponding
 * meta information (climate, energy, land use indicators, etc.) from the scenario
 * database. It performs an efficient lookup to associate meta indicators with data
 * points based on their scenario and model properties.
 *
 * @param {Object} props - The props object
 * @param {DataPoint[]} props.dataPoints - Array of data points to enrich with meta information.
 *   Each data point must have `scenario` and `model` properties for meta lookup.
 *
 * @returns {Object} Hook return object
 * @returns {MetaDataPoint[]} returns.metaDataPoints - Array of enhanced data points,
 *   where each data point includes a `meta` property containing associated MetaPoint objects
 * @returns {boolean} returns.isLoading - Loading state of the meta indicators query
 * @returns {boolean} returns.isError - Error state of the meta indicators query
 *
 * @example
 * ```typescript
 * const originalDataPoints = [
 *   { scenario: "SSP1-1.9", model: "IMAGE", year: 2030, value: 100 },
 *   { scenario: "SSP2-4.5", model: "GCAM", year: 2030, value: 150 }
 * ];
 *
 * const { metaDataPoints, isLoading, isError } = useMapDataPointsToScenarios({
 *   dataPoints: originalDataPoints
 * });
 *
 * if (isLoading) return <Loading />;
 * if (isError) return <Error />;
 *
 * // metaDataPoints now contains:
 * // [
 * //   {
 * //     scenario: "SSP1-1.9",
 * //     model: "IMAGE",
 * //     year: 2030,
 * //     value: 100,
 * //     meta: [
 * //       { model: "IMAGE", scenario: "SSP1-1.9", key: "climate", value: "hot" },
 * //       { model: "IMAGE", scenario: "SSP1-1.9", key: "energy", value: "renewable" }
 * //     ]
 * //   },
 * //   // ...
 * // ]
 * ```
 */
export function useMapDataPointsToScenarios({ dataPoints }: Props): ReturnType {
  /**
   * Extract unique scenario names from the provided data points.
   * Memoized to prevent unnecessary recalculations.
   */
  const scenarioNames = useMemo(() => {
    if (!dataPoints?.length) return [];
    return [...new Set(dataPoints.map((dp) => dp.scenario))];
  }, [dataPoints]);

  /**
   * Fetch meta indicators data for all unique scenarios found in the data points.
   * Query is disabled when no scenarios are present.
   */
  const {
    data: metaData,
    isLoading,
    isError,
  } = useQuery({
    ...queryKeys.metaIndicators.tabulate({
      run: {
        scenario: {
          // @ts-expect-error The SDK expects undefined instead of string[]
          name_in: scenarioNames,
        },
      },
    }),
    enabled: scenarioNames.length > 0,
  });

  /**
   * Process and map data points with their corresponding meta information.
   * Creates an efficient lookup map for O(1) scenario+model matching.
   */
  const metaDataPoints = useMemo((): MetaDataPoint[] => {
    if (!dataPoints?.length || !metaData) {
      return dataPoints || [];
    }

    const metaPoints = getMetaPoints(metaData);

    // Create lookup map: "scenario-model" -> MetaPoint[]
    const metaPointsMap = new Map<string, MetaPoint[]>();

    metaPoints.forEach((metaPoint) => {
      const key = `${metaPoint.scenario}-${metaPoint.model}`;
      if (!metaPointsMap.has(key)) {
        metaPointsMap.set(key, []);
      }
      metaPointsMap.get(key)!.push(metaPoint);
    });

    // Enhance each data point with its corresponding meta information
    return dataPoints.map((dataPoint): MetaDataPoint => {
      const lookupKey = `${dataPoint.scenario}-${dataPoint.model}`;
      const meta = metaPointsMap.get(lookupKey) || [];

      return {
        ...dataPoint,
        meta,
      };
    });
  }, [dataPoints, metaData]);

  return {
    metaDataPoints,
    isLoading,
    isError,
  };
}
