import { useMultipleRunsPipeline } from "@/hooks/runs/pipeline/use-multiple-runs-pipeline";
import { MultipleRunPipelineParams, RunPipelineReturn } from "@/hooks/runs/pipeline/types";

export default function useMultipleRunsBatchFilter({
  variables,
  prefix = "",
}: MultipleRunPipelineParams): RunPipelineReturn {
  const result0 = useMultipleRunsPipeline({ variable: variables[0] || "", prefix });
  const result1 = useMultipleRunsPipeline({ variable: variables[1] || "", prefix });
  const result2 = useMultipleRunsPipeline({ variable: variables[2] || "", prefix });
  const result3 = useMultipleRunsPipeline({ variable: variables[3] || "", prefix });
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
