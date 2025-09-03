import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { DataPoint } from "@/components/plots/types";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";
import { UseQueryResult } from "@tanstack/react-query";

export interface ExtendedRun {
  runId: string;
  scenarioName: string;
  modelName: string;
  variableName: string;
  orderedPoints: ShortDataPoint[];
  flagCategory: CategoryKey;
  metaIndicators: ShortMetaIndicator[];
}

export interface RunPipelineReturn {
  runs: ExtendedRun[];
  isLoading: boolean;
  isError: boolean;
}

export interface SingleRunPipelineParams {
  variable: string;
  prefix?: string;
}

export type DataPointsQueriesReturn = Array<
  UseQueryResult<{
    dataPoints: DataPoint[];
    uniqueIds: Array<string>;
    variable: string;
  }>
>;

export type MetaPointsQueriesReturn = Array<
  UseQueryResult<{
    metaPoints: MetaIndicator[];
    uniqueIds: Array<string>;
  }>
>;

export type ShortDataPoint = Pick<DataPoint, "year" | "value">;
export type ShortMetaIndicator = Pick<MetaIndicator, "key" | "value">;
