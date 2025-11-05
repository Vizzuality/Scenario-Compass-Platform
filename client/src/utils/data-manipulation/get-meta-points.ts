import { DataFrame } from "@iiasa/ixmp4-ts";
import { MetaIndicator } from "@/types/data/meta-indicator";

export interface RowFilterProps {
  prefix?: string;
}

/**
 * Extracts meta points from a DataFrame
 * @param data DataFrame containing meta information
 * @returns Array of MetaPoint objects
 */
export function getMetaPoints(data: DataFrame | undefined): MetaIndicator[] {
  if (!data) {
    return [];
  }

  const columns = data.columns;
  const [rows] = data.shape;

  if (rows === 0 || columns.length === 0) {
    return [];
  }

  const runIdCol = columns.find((col) => col.toLowerCase() === "run__id");
  const keyCol = columns.find((col) => col.toLowerCase() === "key");
  const valueCol = columns.find((col) => col.toLowerCase() === "value");
  if (!runIdCol || !keyCol || !valueCol) {
    console.error(
      "Missing required columns: run__id, key or value" + "" + `Found ${columns.join(", ")}`,
    );
    return [];
  }

  const metaIndicators: MetaIndicator[] = [];

  for (let i = 0; i < rows; i++) {
    const key = data.at(i, keyCol);
    const value = data.at(i, valueCol);
    const runId = data.at(i, runIdCol);

    if (runId == null || key == null || value == null) {
      continue;
    }

    metaIndicators.push({
      runId: String(runId),
      key: String(key),
      value: String(value),
    });
  }

  return metaIndicators;
}
