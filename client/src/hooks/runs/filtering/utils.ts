import { DataFrame } from "@iiasa/ixmp4-ts";
import { DataPoint } from "@/components/plots/types";
import { geographyOptions } from "@/lib/constants";

export interface DataPointsFilterParams {
  runId?: number | null;
  geography: string | null;
  year?: string | null;
  startYear: string | null;
  endYear: string | null;
  variable: string;
}

export const extractDataPoints = (data: DataFrame | undefined): DataPoint[] | [] => {
  if (data === undefined) {
    return [];
  }

  const dataPoints: DataPoint[] = [];
  const [rows] = data.shape;
  const columns: string[] = data.columns;

  const runIdCol = columns.find((col) => col.toLowerCase() === "run__id");
  const scenarioCol = columns.find((col) => col.toLowerCase().includes("scenario"));
  const modelCol = columns.find((col) => col.toLowerCase().includes("model"));
  const yearCol = columns.find((col) => col.toLowerCase().includes("year"));
  const valueCol = columns.find((col) => col.toLowerCase().includes("value"));

  if (!scenarioCol || !yearCol || !valueCol || !modelCol || !runIdCol) {
    console.error("Missing required columns: scenario, year, value or model");
    return [];
  }

  for (let i = 0; i < rows; i++) {
    const runId = data.at(i, runIdCol);
    const scenario = data.at(i, scenarioCol);
    const model = data.at(i, modelCol);
    const year = data.at(i, yearCol);
    const value = data.at(i, valueCol);

    if (scenario != null && year != null && value != null) {
      dataPoints.push({
        runId: runId,
        scenarioName: String(scenario),
        modelName: String(model),
        year: Number(year),
        value: Number(value),
      });
    }
  }

  return dataPoints;
};

export const getDataPointsFilter = ({
  geography,
  year,
  startYear,
  endYear,
  variable,
}: Omit<DataPointsFilterParams, "runId">) => {
  const baseFilter = {
    region: { name: geographyOptions.find((g) => g.value === geography)?.lookupName },
    variable: {
      name: variable,
    },
  };

  if (year) {
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
