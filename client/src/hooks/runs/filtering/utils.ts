import { DataFrame } from "@iiasa/ixmp4-ts";
import { DataPoint } from "@/components/plots/types";
import { geographyConfig } from "@/lib/config/filters/geography-filter-config";

export interface DataPointsFilterParams {
  runId?: number | null;
  geography: string | null;
  year?: string | null;
  startYear: string | null;
  endYear: string | null;
  variable: string;
}
export type DataPointWithVariable = Pick<DataPoint, "year" | "runId" | "value"> & {
  variable: string;
};

export const extractDataPointsWithVariable = (
  data: DataFrame | undefined,
): DataPointWithVariable[] => {
  if (data === undefined) {
    return [];
  }

  const dataPoints: Array<DataPointWithVariable> = [];
  const [rows] = data.shape;
  const columns: string[] = data.columns;

  const runIdCol = columns.find((col) => col.toLowerCase() === "run__id");
  const yearCol = columns.find((col) => col.toLowerCase().includes("year"));
  const valueCol = columns.find((col) => col.toLowerCase().includes("value"));
  const variableCol = columns.find((col) => col.toLowerCase().includes("variable"));

  if (!yearCol || !valueCol || !runIdCol || !variableCol) {
    console.error("Missing required columns: scenario, year, value, model or variable");
    return [];
  }

  for (let i = 0; i < rows; i++) {
    const runId = data.at(i, runIdCol);
    const year = data.at(i, yearCol);
    const value = data.at(i, valueCol);
    const variable = data.at(i, variableCol);

    if (year != null && value != null && variable != null) {
      dataPoints.push({
        runId: runId,
        year: Number(year),
        value: Number(value),
        variable: String(variable),
      });
    }
  }

  return dataPoints;
};

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
  const variableCol = columns.find((col) => col.toLowerCase().includes("variable"));
  const unitCol = columns.find((col) => col.toLowerCase().includes("unit"));

  if (!scenarioCol || !yearCol || !valueCol || !modelCol || !runIdCol || !variableCol || !unitCol) {
    return [];
  }

  for (let i = 0; i < rows; i++) {
    const runId = data.at(i, runIdCol);
    const scenario = data.at(i, scenarioCol);
    const model = data.at(i, modelCol);
    const year = data.at(i, yearCol);
    const value = data.at(i, valueCol);
    const variable = data.at(i, variableCol);
    const unit = data.at(i, unitCol);

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

export const getDataPointsFilter = ({
  geography,
  year,
  startYear,
  endYear,
  variable,
}: Omit<DataPointsFilterParams, "runId">) => {
  const baseFilter = {
    region: { name: geographyConfig.find((g) => g.value === geography)?.lookupName },
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
