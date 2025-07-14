import { useScenarioDashboardUrlParams } from "@/hooks/use-scenario-dashboard-url-params";
import useTopDataPointsFilter from "@/hooks/use-top-data-points-filter";
import { useMapDataPointsToScenarios } from "@/hooks/use-map-data-points-to-scenarios";
import { useMetaIndicatorsFilter } from "@/hooks/use-meta-indicators-filter";
import { MetaDataPoint } from "@/components/plots/types/plots";

/**
 * Comprehensive data processing pipeline hook that fetches, enriches, and filters scenario data points.
 *
 * This hook orchestrates a complete data pipeline by combining multiple specialized hooks to:
 * 1. Extract URL-based filter parameters (geography, temporal, meta indicators)
 * 2. Fetch raw data points based on geographic, temporal, and variable filters
 * 3. Enrich data points with meta indicator information (climate, energy, land)
 * 4. Apply meta indicator filtering to return only matching data points
 *
 * The pipeline automatically handles the dependencies between each step and manages
 * loading states across all operations. This provides a single, simple interface
 * for complex data processing workflows commonly needed in scenario dashboards.
 *
 * @param {string} variable - The variable name to fetch data for (e.g., "Primary Energy|Coal", "Emissions|CO2").
 *   This parameter is required and determines which type of scenario data to retrieve.
 *
 * @returns {DataPoint[]} Array of filtered data points that match all specified criteria.
 *   Returns an empty array if no data matches the filters or if any step in the pipeline fails.
 *   Each data point contains scenario, model, year, and value information.
 *
 * @example
 * ```typescript
 * // Basic usage - get filtered energy data
 * function EnergyChart() {
 *   const filteredData = useFilterPointsPipeline("Primary Energy|Coal");
 *
 *   if (!filteredData.length) {
 *     return <NoData message="No coal energy data matches current filters" />;
 *   }
 *
 *   return <LineChart data={filteredData} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Multiple variables in a dashboard
 * function EnergyDashboard() {
 *   const coalData = useFilterPointsPipeline("Primary Energy|Coal");
 *   const solarData = useFilterPointsPipeline("Primary Energy|Solar");
 *   const windData = useFilterPointsPipeline("Primary Energy|Wind");
 *
 *   return (
 *     <div className="grid grid-cols-3 gap-4">
 *       <EnergyChart title="Coal" data={coalData} />
 *       <EnergyChart title="Solar" data={solarData} />
 *       <EnergyChart title="Wind" data={windData} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using with loading states and error handling
 * function ScenarioVisualization({ variable }: { variable: string }) {
 *   const filteredData = useFilterPointsPipeline(variable);
 *
 *   // The pipeline handles loading internally, but you can check data availability
 *   const hasData = filteredData.length > 0;
 *   const isEmpty = filteredData.length === 0;
 *
 *   return (
 *     <div>
 *       <h2>{variable} Analysis</h2>
 *       {isEmpty ? (
 *         <EmptyState message="No data available for current filter selection" />
 *       ) : (
 *         <>
 *           <DataSummary count={filteredData.length} />
 *           <VisualizationComponent data={filteredData} />
 *         </>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Integration with external state management
 * function AdvancedDashboard() {
 *   const [selectedVariable, setSelectedVariable] = useState("Emissions|CO2");
 *   const filteredData = useFilterPointsPipeline(selectedVariable);
 *
 *   const handleVariableChange = (newVariable: string) => {
 *     setSelectedVariable(newVariable);
 *     // Data will automatically update due to hook dependency
 *   };
 *
 *   return (
 *     <div>
 *       <VariableSelector
 *         selected={selectedVariable}
 *         onChange={handleVariableChange}
 *       />
 *       <DataVisualization data={filteredData} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @pipeline The data processing pipeline executes in the following order:
 * 1. **URL Parameter Extraction**: Gets current filter state from URL
 *    - Geographic filters (geography)
 *    - Temporal filters (year, startYear, endYear)
 *    - Meta indicator filters (climate, energy, land)
 *
 * 2. **Data Fetching**: Retrieves raw data points based on filters
 *    - Fetches data for the specified variable
 *    - Applies geographic and temporal filtering
 *    - Automatically disabled when required parameters are missing
 *
 * 3. **Meta Enrichment**: Adds meta indicator information
 *    - Fetches meta indicators for all scenarios in the data
 *    - Maps meta information to each data point
 *    - Creates enhanced MetaDataPoint objects
 *
 * 4. **Meta Filtering**: Applies final filtering based on meta indicators
 *    - Filters data points by climate, energy, land values
 *    - Uses AND logic (all specified filters must match)
 *    - Returns final filtered DataPoint array
 *
 * @performance The hook automatically optimizes performance through:
 * - Memoization at each pipeline step prevents unnecessary recalculations
 * - React Query caching reduces duplicate API calls
 * - Automatic query enabling/disabling based on parameter availability
 * - Efficient lookup algorithms for meta data mapping
 *
 * @dependencies This hook depends on URL-based state management. Ensure that:
 * - URL parameters are properly configured for dashboard filters
 * - Geography options are available and properly configured
 * - Meta indicator mappings are set up correctly
 *
 * @note The pipeline will return an empty array if any step fails or if no data
 *   matches the combined filter criteria. Individual loading states are handled
 *   internally and don't need to be managed by the consuming component.
 *
 * @note All filters use exact string matching. Partial matching or fuzzy
 *   search is not supported in the current implementation.
 *
 * @see {@link useScenarioDashboardUrlParams} For URL parameter management
 * @see {@link useTopDataPointsFilter} For data fetching and basic filtering
 * @see {@link useMapDataPointsToScenarios} For meta data enrichment
 * @see {@link useMetaIndicatorsFilter} For meta-based filtering
 *
 * @since 1.0.0
 */
export function useFilterPointsPipeline(variable: string): {
  dataPoints: MetaDataPoint[];
  isLoading: boolean;
  isError: boolean;
} {
  // Extract filter parameters from URL state
  const { year, endYear, startYear, geography, climate, energy, land } =
    useScenarioDashboardUrlParams();

  // Step 1: Fetch raw data points based on geographic, temporal, and variable filters
  const {
    dataPoints,
    isLoading: isTopFilterLoading,
    isError: isTopFilterError,
  } = useTopDataPointsFilter({
    year,
    startYear,
    endYear,
    geography,
    variable,
  });

  // Step 2: Enrich data points with meta indicator information
  const {
    metaDataPoints,
    isLoading: isMappingLoading,
    isError: isMappingError,
  } = useMapDataPointsToScenarios({ dataPoints });

  // Step 3: Apply meta indicator filtering and return final result
  const filteredMetaDataPoints = useMetaIndicatorsFilter({
    metaDataPoints: metaDataPoints,
    climate,
    energy,
    land,
  });

  const isError = isMappingError || isTopFilterError;
  const isLoading = isMappingLoading || isTopFilterLoading;

  return { dataPoints: filteredMetaDataPoints, isError, isLoading };
}
