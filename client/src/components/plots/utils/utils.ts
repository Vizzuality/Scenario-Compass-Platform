import { DataFrame } from "@iiasa/ixmp4-ts";
import { DataPoint } from "@/components/plots/types/plots";

export const extractDataPoints = (data: DataFrame | undefined): DataPoint[] | [] => {
  if (data === undefined) {
    return [];
  }

  const dataPoints: DataPoint[] = [];
  const [rows] = data.shape;
  const columns: string[] = data.columns;

  const scenarioCol = columns.find((col) => col.toLowerCase().includes("scenario"));
  const modelCol = columns.find((col) => col.toLowerCase().includes("model"));
  const yearCol = columns.find((col) => col.toLowerCase().includes("year"));
  const valueCol = columns.find((col) => col.toLowerCase().includes("value"));

  if (!scenarioCol || !yearCol || !valueCol || !modelCol) {
    console.error("Missing required columns: scenario, year, value or model");
    return [];
  }

  for (let i = 0; i < rows; i++) {
    const scenario = data.at(i, scenarioCol);
    const model = data.at(i, modelCol);
    const year = data.at(i, yearCol);
    const value = data.at(i, valueCol);

    if (scenario != null && year != null && value != null) {
      dataPoints.push({
        scenarioName: String(scenario),
        modelName: String(model),
        year: Number(year),
        value: Number(value),
      });
    }
  }

  return dataPoints;
};
