import { DataFrame } from "@iiasa/ixmp4-ts";
import { DataPoint } from "@/types/data/data-point";

/**
 * @fileoverview Data extraction utility for converting IIASA DataFrame objects into plottable data points.
 *
 * This module provides functionality to transform tabular data from the IIASA API into a standardized
 * format suitable for visualization components. It handles column name variations, missing data,
 * and type conversions.
 *
 * @module data-point-extraction
 */

/**
 * Standard column name identifiers used to locate data in DataFrames.
 * They represent the same mapping as the fields used by the DataFrames.
 * These constants define the expected column names (case-insensitive) for extracting data.
 *
 * @constant
 * @private
 */
const RUN__ID_COL = "run__id";
const SCENARIO_COL = "scenario";
const MODEL_COL = "model";
const YEAR_COL = "year";
const VALUE_COL = "value";
const VARIABLE_COL = "variable";
const UNIT_COL = "unit";

/**
 * Extracts and transforms data points from an IIASA DataFrame into a standardized format for plotting.
 *
 * This function performs the following operations:
 * 1. Locates required columns by name (case-insensitive matching)
 * 2. Validates that all essential columns are present
 * 3. Iterates through all rows in the DataFrame
 * 4. Converts raw data values to appropriate types (string, number)
 * 5. Filters out rows with missing critical values (scenario, year, value)
 * 6. Returns an array of structured DataPoint objects
 *
 * @param data - DataFrame from IIASA API containing tabulated scenario data, or undefined
 *
 * @returns Array of structured DataPoint objects, or empty array if:
 *   - Input DataFrame is undefined
 *   - Required columns are not found
 *   - No valid rows exist in the DataFrame
 *
 * @example
 * ```typescript
 * const dataPoints = extractDataPoints(apiData);
 * console.log(dataPoints);
 * [
 *    {
 *      runId: 12345,
 *      scenarioName: "SSP2-4.5",
 *      modelName: "MESSAGE",
 *      year: 2030,
 *      value: 42.5,
 *      variable: "Emissions|CO2",
 *      unit: "Mt CO2/yr"
 *    },
 *   ...
 * ]
 * ```
 *
 * @remarks
 * **Missing Data Handling:**
 * - Rows missing scenario, year, or value are silently skipped
 * - Rows with null/undefined in other fields are still included
 * - Run IDs, models, variables, and units are converted even if null (Number(null) = 0, String(null) = "null")
 *
 * **Data Quality:**
 * - No validation of numeric ranges (negative years, invalid values accepted)
 * - No deduplication of data points
 * - Assumes DataFrame structure is consistent across all rows
 *
 * @see {@link DataPoint} for the structure of returned objects
 */
export const extractDataPoints = (data: DataFrame | undefined): DataPoint[] | [] => {
  if (data === undefined) {
    return [];
  }

  const dataPoints: DataPoint[] = [];

  const [rows] = data.shape;
  const columns: string[] = data.columns;

  const runIdCol = columns.find((col) => col.toLowerCase() === RUN__ID_COL);
  const scenarioCol = columns.find((col) => col.toLowerCase().includes(SCENARIO_COL));
  const modelCol = columns.find((col) => col.toLowerCase().includes(MODEL_COL));
  const yearCol = columns.find((col) => col.toLowerCase().includes(YEAR_COL));
  const valueCol = columns.find((col) => col.toLowerCase().includes(VALUE_COL));
  const variableCol = columns.find((col) => col.toLowerCase().includes(VARIABLE_COL));
  const unitCol = columns.find((col) => col.toLowerCase().includes(UNIT_COL));

  /**
   * Validate that all required columns were found.
   * If any essential column is missing, return empty array
   * to indicate that data cannot be extracted.
   */
  if (!scenarioCol || !yearCol || !valueCol || !modelCol || !runIdCol || !variableCol || !unitCol) {
    return [];
  }

  /**
   * Iterate through all rows and extract data points.
   * Each row represents one data point in the time series.
   */
  for (let i = 0; i < rows; i++) {
    const runId = data.at(i, runIdCol);
    const scenario = data.at(i, scenarioCol);
    const model = data.at(i, modelCol);
    const year = data.at(i, yearCol);
    const value = data.at(i, valueCol);
    const variable = data.at(i, variableCol);
    const unit = data.at(i, unitCol);

    /**
     * Skip rows with missing critical values.
     * Scenario, year, and value are essential for plotting,
     * so rows missing these fields are excluded.
     */
    if (scenario != null && year != null && value != null) {
      dataPoints.push({
        runId: runId,
        scenarioName: String(scenario),
        modelName: String(model),
        year: Number(year),
        value: Number(value),
        variable: String(variable),
        unit: String(unit),
      });
    }
  }

  return dataPoints;
};
