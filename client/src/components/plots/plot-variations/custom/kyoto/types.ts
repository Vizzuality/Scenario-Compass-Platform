import { ShortDataPoint } from "@/hooks/runs/pipeline/types";
import { CategoryKey } from "@/lib/config/reasons-of-concern/category-config";

export interface ShortRun {
  orderedPoints: ShortDataPoint[];
  variableName: string;
  isLine: boolean;
}

export interface ShortRunReturn {
  shortRuns: ShortRun[];
  flagCategory: CategoryKey;
}
