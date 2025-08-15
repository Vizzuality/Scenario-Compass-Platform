import { DataFrame } from "@iiasa/ixmp4-ts";

export interface MetaIndicator {
  modelName: string;
  scenarioName: string;
  key: string;
  value: string;
}

type ColumnMap = MetaIndicator;

/**
 * Find column names that match the required fields
 */
function findColumns(columns: string[]): ColumnMap | null {
  const findColumn = (searchTerm: string) =>
    columns.find((col) => col.toLowerCase().includes(searchTerm.toLowerCase()));

  const model = findColumn("model");
  const scenario = findColumn("scenario");
  const key = findColumn("key");
  const value = findColumn("value");

  if (!model || !scenario || !key || !value) {
    return null;
  }

  return { modelName: model, scenarioName: scenario, key, value };
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

  const columnMap = findColumns(columns);
  if (!columnMap) {
    console.error(
      `Missing required columns. Found: [${columns.join(", ")}]. ` +
        `Expected columns containing: model, scenario, key, value`,
    );
    return [];
  }

  const dataPoints: MetaIndicator[] = [];

  for (let i = 0; i < rows; i++) {
    const model = data.at(i, columnMap.modelName);
    const scenario = data.at(i, columnMap.scenarioName);
    const key = data.at(i, columnMap.key);
    const value = data.at(i, columnMap.value);

    if (model == null || scenario == null || key == null || value == null) {
      continue;
    }

    dataPoints.push({
      modelName: String(model),
      scenarioName: String(scenario),
      key: String(key),
      value: String(value),
    });
  }

  return dataPoints;
}
