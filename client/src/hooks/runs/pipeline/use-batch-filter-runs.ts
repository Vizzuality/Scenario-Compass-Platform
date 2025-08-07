import {
  RunPipelineReturn,
  useNewFilterPointsPipeline,
} from "@/hooks/runs/pipeline/use-runs-filtering-pipeline";
import { VARIABLE_TYPE } from "@/lib/constants/variables-options";

interface PipelineParams {
  variables: readonly VARIABLE_TYPE[];
  prefix?: string;
}

export default function useBatchFilterRuns({
  variables,
  prefix = "",
}: PipelineParams): RunPipelineReturn {
  const result0 = useNewFilterPointsPipeline({ variable: variables[0] || "", prefix });
  const result1 = useNewFilterPointsPipeline({ variable: variables[1] || "", prefix });
  const result2 = useNewFilterPointsPipeline({ variable: variables[2] || "", prefix });
  const result3 = useNewFilterPointsPipeline({ variable: variables[3] || "", prefix });
  const results = [result0, result1, result2, result3];

  const runs = results.flatMap((r) => r.runs);
  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return {
    runs,
    isLoading,
    isError,
  };
}
