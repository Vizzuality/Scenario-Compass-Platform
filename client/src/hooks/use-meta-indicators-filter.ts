import { MetaDataPoint } from "@/components/plots/types/plots";
import { useMemo } from "react";

interface Props {
  metaDataPoints?: MetaDataPoint[];
  climate: string | null;
  energy: string | null;
  land: string | null;
}

/**
 * Hook for filtering data points based on meta indicator values (climate, energy, land).
 *
 * This hook filters an array of MetaDataPoint objects by matching their associated meta
 * indicator values against the provided filter criteria. It uses exact string matching
 * and requires ALL specified filters to match for a data point to be included in the result.
 *
 * The filtering logic works as follows:
 * - If no filters are provided (all null), returns all data points
 * - If any filter is provided, only data points with matching meta values are included
 * - Data points without meta information are excluded when filters are applied
 * - Uses AND logic - all specified filters must match
 *
 * @param {Object} params - Filter parameters object
 * @param {MetaDataPoint[]} [params.metaDataPoints] - Array of data points with meta information to filter.
 *   Each data point should have a `meta` property containing MetaPoint objects.
 * @param {string|null} params.climate - Climate indicator value to filter by.
 *   When provided, only data points with meta containing this exact climate value are included.
 * @param {string|null} params.energy - Energy indicator value to filter by.
 *   When provided, only data points with meta containing this exact energy value are included.
 * @param {string|null} params.land - Land use indicator value to filter by.
 *   When provided, only data points with meta containing this exact land value are included.
 *
 * @returns {MetaDataPoint[]} Array of filtered data points that match all specified criteria.
 *   Returns empty array if no data points are provided or none match the filters.
 *
 * @example
 * ```typescript
 * // Filter by climate only
 * const filteredData = useMetaIndicatorsFilter({
 *   metaDataPoints: enrichedDataPoints,
 *   climate: "hot",
 *   energy: null,
 *   land: null
 * });
 *
 * // Only returns data points where meta contains { key: "climate", value: "hot" }
 * ```
 *
 * @example
 * ```typescript
 * // Filter by multiple criteria (AND logic)
 * const filteredData = useMetaIndicatorsFilter({
 *   metaDataPoints: enrichedDataPoints,
 *   climate: "hot",
 *   energy: "renewable",
 *   land: "forest"
 * });
 *
 * // Only returns data points that have ALL three meta values:
 * // - climate: "hot"
 * // - energy: "renewable"
 * // - land: "forest"
 * ```
 *
 * @example
 * ```typescript
 * // Integration with other hooks
 * function ScenarioAnalysis() {
 *   const { dataPoints } = useTopDataPointsFilter({...});
 *   const { metaDataPoints } = useMapDataPointsToScenarios({ dataPoints });
 *   const { climate, energy, land } = useScenarioDashboardMetaIndicatorsFilterUrl();
 *
 *   const filteredData = useMetaIndicatorsFilter({
 *     metaDataPoints,
 *     climate,
 *     energy,
 *     land
 *   });
 *
 *   return <Chart data={filteredData} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // No filters - returns all data
 * const allData = useMetaIndicatorsFilter({
 *   metaDataPoints: enrichedDataPoints,
 *   climate: null,
 *   energy: null,
 *   land: null
 * });
 * // Returns: enrichedDataPoints (unchanged)
 * ```
 *
 * @example
 * ```typescript
 * // Handling loading states
 * function DataVisualization() {
 *   const { metaDataPoints, isLoading } = useMapDataPointsToScenarios({...});
 *
 *   const filteredData = useMetaIndicatorsFilter({
 *     metaDataPoints,
 *     climate: "moderate",
 *     energy: null,
 *     land: null
 *   });
 *
 *   if (isLoading) return <Loading />;
 *   if (!filteredData.length) return <NoData message="No data matches the selected filters" />;
 *
 *   return <Dashboard data={filteredData} />;
 * }
 * ```
 *
 * @performance The hook uses `useMemo` to prevent unnecessary recalculations.
 *   Filtering only occurs when dataPoints or filter values change.
 *
 * @note This hook uses exact string matching (`===`) for filter values.
 *   Partial matching or case-insensitive matching is not supported.
 *
 * @note Data points without meta information are automatically excluded
 *   when any filter is applied, even if the filter would otherwise match.
 *
 * @see {@link useMapDataPointsToScenarios} For enriching data points with meta information
 * @see {@link useScenarioDashboardMetaIndicatorsFilterUrl} For URL-based filter state management
 *
 * @since 1.0.0
 */
export function useMetaIndicatorsFilter({
  metaDataPoints,
  climate,
  energy,
  land,
}: Props): MetaDataPoint[] {
  return useMemo(() => {
    // Return empty array if no data points provided
    if (!metaDataPoints?.length) {
      return [];
    }

    // If no filters are specified, return all data points unchanged
    if (!climate && !energy && !land) {
      return metaDataPoints;
    }

    // Filter data points based on meta indicator criteria
    return metaDataPoints.filter((point) => {
      // Exclude data points without meta information
      if (!point.meta?.length) {
        return false;
      }

      // Initialize match flags - assume filter passes if not specified
      let matchesClimate = !climate;
      let matchesEnergy = !energy;
      let matchesLand = !land;

      // Check each meta point for matching values
      point.meta.forEach((metaPoint) => {
        if (climate && metaPoint.value === climate) {
          matchesClimate = true;
        }
        if (energy && metaPoint.value === energy) {
          matchesEnergy = true;
        }
        if (land && metaPoint.value === land) {
          matchesLand = true;
        }
      });

      // Return true only if ALL specified filters match (AND logic)
      return matchesClimate && matchesEnergy && matchesLand;
    });
  }, [metaDataPoints, climate, energy, land]);
}
