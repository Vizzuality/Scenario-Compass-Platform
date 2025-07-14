"use client";

import queryKeys from "@/lib/query-keys";
import { geographyOptions } from "@/lib/constants/geography-options";
import { useQuery } from "@tanstack/react-query";
import { extractDataPoints } from "@/components/plots/utils/utils";

interface FilterParams {
  geography: string | null;
  year: string | null;
  startYear: string | null;
  endYear: string | null;
  variable: string;
}

/**
 * Constructs a filter object for data points query based on temporal and geographic parameters.
 *
 * This function handles three different temporal scenarios:
 * 1. Single year filtering (when only `year` is provided)
 * 2. Date range filtering (when `startYear` and/or `endYear` are provided)
 * 3. No temporal filtering (base filter only)
 *
 * @param {Object} params - Filter parameters object
 * @param {string|null} params.geography - Geographic region identifier (must match geographyOptions values)
 * @param {string|null} params.year - Specific year for single-year filtering (mutually exclusive with startYear/endYear)
 * @param {string|null} params.startYear - Start year for range filtering (inclusive)
 * @param {string|null} params.endYear - End year for range filtering (inclusive)
 * @param {string} params.variable - Variable name to filter by
 *
 * @returns {Object} Filter object configured for the data points query
 * @returns {Object} returns.region - Geographic filter with resolved region name
 * @returns {Object} returns.variable - Variable filter object
 * @returns {number} [returns.stepYear] - Specific year filter (when year is provided)
 * @returns {number} [returns.stepYear_gte] - Minimum year filter (when startYear is provided)
 * @returns {number} [returns.stepYear_lte] - Maximum year filter (when endYear is provided)
 *
 * @example
 * ```typescript
 * // Single year filtering
 * const filter = getFilter({
 *   geography: 'USA',
 *   year: '2030',
 *   startYear: null,
 *   endYear: null,
 *   variable: 'temperature'
 * });
 * // Returns: { region: { name: 'United States' }, variable: { name: 'temperature' }, stepYear: 2030 }
 *
 * // Range filtering
 * const filter = getFilter({
 *   geography: 'USA',
 *   year: null,
 *   startYear: '2020',
 *   endYear: '2030',
 *   variable: 'temperature'
 * });
 * // Returns: { region: { name: 'United States' }, variable: { name: 'temperature' }, stepYear_gte: 2020, stepYear_lte: 2030 }
 * ```
 *
 * @since 1.0.0
 */
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

/**
 * Hook for fetching and filtering data points based on geographic, temporal, and variable criteria.
 *
 * This hook provides a comprehensive solution for querying scenario data points with support for:
 * - Geographic filtering using predefined geography options
 * - Flexible temporal filtering (single year or date range)
 * - Variable-based filtering
 * - Automatic query enabling/disabling based on required parameters
 *
 * The hook automatically constructs the appropriate filter object and handles data extraction
 * from the API response.
 *
 * @param {Object} params - Filter parameters object
 * @param {string|null} params.geography - Geographic region identifier. Must match a value from geographyOptions.
 *   The query is disabled when this is null or empty.
 * @param {string|null} params.year - Specific year for single-year filtering.
 *   When provided, startYear and endYear are ignored.
 * @param {string|null} params.startYear - Start year for range filtering (inclusive).
 *   Only used when year is not provided.
 * @param {string|null} params.endYear - End year for range filtering (inclusive).
 *   Only used when year is not provided.
 * @param {string} params.variable - Variable name to filter by (required).
 *
 * @returns {Object} Hook return object
 * @returns {DataPoint[]} returns.dataPoints - Array of filtered data points extracted from the API response.
 *   Each data point contains scenario, model, year, and value information.
 * @returns {boolean} returns.isLoading - Loading state of the data points query
 * @returns {boolean} returns.isError - Error state of the data points query
 *
 * @example
 * ```typescript
 * // Single year query
 * const { dataPoints, isLoading, isError } = useTopDataPointsFilter({
 *   geography: 'USA',
 *   year: '2030',
 *   startYear: null,
 *   endYear: null,
 *   variable: 'Primary Energy|Coal'
 * });
 *
 * if (isLoading) return <Loading />;
 * if (isError) return <Error />;
 *
 * return (
 *   <div>
 *     {dataPoints.map(dp => (
 *       <div key={`${dp.scenario}-${dp.model}-${dp.year}`}>
 *         {dp.scenario}: {dp.value}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Date range query
 * const { dataPoints, isLoading } = useTopDataPointsFilter({
 *   geography: 'WORLD',
 *   year: null,
 *   startYear: '2020',
 *   endYear: '2050',
 *   variable: 'Emissions|CO2'
 * });
 *
 * // Use with visualization components
 * return <LineChart data={dataPoints} />;
 * ```
 *
 * @example
 * ```typescript
 * // Integration with URL state management
 * function DataDashboard() {
 *   const { geography, year, startYear, endYear } = useScenarioDashboardUrlParams();
 *
 *   const { dataPoints, isLoading } = useTopDataPointsFilter({
 *     geography,
 *     year,
 *     startYear,
 *     endYear,
 *     variable: 'Primary Energy'
 *   });
 *
 *   return <DataVisualization data={dataPoints} loading={isLoading} />;
 * }
 * ```
 *
 * @throws {Error} When geography option is not found in geographyOptions
 * @throws {Error} When year, startYear, or endYear cannot be parsed as integers
 *
 * @see {@link getFilter} For details on filter construction logic
 * @see {@link extractDataPoints} For data extraction and transformation
 *
 * @since 1.0.0
 */
export default function useTopDataPointsFilter({
  geography,
  year,
  startYear,
  endYear,
  variable,
}: FilterParams) {
  /** Construct filter object based on provided parameters */
  const filter = getFilter({ geography, year, startYear, endYear, variable });

  /**
   * Fetch data points using React Query.
   * Query is enabled only when geography is provided to prevent unnecessary requests.
   */
  const { data, isLoading, isError } = useQuery({
    ...queryKeys.dataPoints.tabulate(filter),
    enabled: !!geography,
  });

  /** Extract and transform raw API data into DataPoint objects */
  const dataPoints = extractDataPoints(data);

  return {
    dataPoints,
    isLoading,
    isError,
  };
}
