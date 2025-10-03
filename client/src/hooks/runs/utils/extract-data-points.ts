import { DataFrame } from "@iiasa/ixmp4-ts";
import { DataPoint } from "@/components/plots/types";

const RUN__ID_COL = "run__id";
const SCENARIO_COL = "scenario";
const MODEL_COL = "model";
const YEAR_COL = "year";
const VALUE_COL = "value";
const VARIABLE_COL = "variable";
const UNIT_COL = "unit";

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
