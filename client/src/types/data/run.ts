import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";
import { DataPoint } from "@/types/data/data-point";
import { MetaIndicator } from "@/types/data/meta-indicator";

export interface ExtendedRun {
  runId: string;
  scenarioName: string;
  modelName: string;
  variableName: string;
  unit: string;
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
  defaults?: {
    startYear?: number;
    endYear?: number;
    geography?: string;
  };
}

export type ShortDataPoint = Pick<DataPoint, "year" | "value">;
export type ShortMetaIndicator = Pick<MetaIndicator, "key" | "value">;
