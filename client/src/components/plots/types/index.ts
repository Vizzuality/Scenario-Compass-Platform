/**
 * Data point extracted from IAMC format.
 */
interface DataPoint {
  runId: string;
  scenarioName: string;
  modelName: string;
  year: number;
  value: number;
  variable: string;
  unit: string;
}

/**
 * Aggregated data point for area chart.
 * It contains the minimum, maximum, and average values for a given year.
 * For ANNUAL data, it is the same as the original data point.
 *
 * @interface AggregatedDataPoint
 * @property {number} year - The year of the aggregated data point.
 * @property {number} min - The minimum value for the year.
 * @property {number} max - The maximum value for the year.
 * @property {number} average - The average value for the year.
 * @property {number} median - The median value for the year
 */
interface AggregatedDataPoint {
  year: number;
  min: number;
  max: number;
  average: number;
  median: number;
}

/**
 * Processed data for area chart.
 *
 * @interface ProcessedAreaData
 * @property {AggregatedDataPoint[]} aggregatedData - Array of aggregated data points.
 * @property {[number, number]} xDomain - The x-axis domain as a tuple of [min, max].
 * @property {[number, number]} yDomain - The y-axis domain as a tuple of [min, max].
 */
interface ProcessedAreaData {
  aggregatedData: AggregatedDataPoint[];
  xDomain: [number, number];
  yDomain: [number, number];
}

export type { DataPoint, ProcessedAreaData, AggregatedDataPoint };
