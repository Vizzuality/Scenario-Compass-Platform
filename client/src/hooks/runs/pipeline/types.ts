import { CategoryKey } from "@/containers/scenario-dashboard/utils/category-config";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import { DataPoint } from "@/components/plots/types";
import { MetaIndicator } from "@/containers/scenario-dashboard/components/meta-scenario-filters/utils";

export interface ExtendedRun {
  runId: string;
  scenarioName: string;
  modelName: string;
  points: ShortDataPoint[];
  flagCategory: CategoryKey;
  metaIndicators: ShortMetaIndicator[];
}

export interface RunPipelineReturn {
  runs: ExtendedRun[];
  isLoading: boolean;
  isError: boolean;
}

export interface SingleRunPipelineParams {
  variable: VARIABLE_TYPE;
  prefix?: string;
}

export interface MultipleRunPipelineParams {
  variables: readonly VARIABLE_TYPE[];
  prefix?: string;
}

export type ShortDataPoint = Pick<DataPoint, "year" | "value">;
export type ShortMetaIndicator = Pick<MetaIndicator, "key" | "value">;
