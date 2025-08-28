import { VARIABLE_TYPE } from "@/lib/constants/variables-options";
import { useSingleRunPipeline } from "@/hooks/runs/pipeline/use-single-run-pipeline";
import { RunPipelineReturn } from "@/hooks/runs/pipeline/types";

interface PipelineParams {
  variables: readonly VARIABLE_TYPE[];
  runId: number;
}

export default function useSingleRunBatchFilter({
  variables,
  runId,
}: PipelineParams): RunPipelineReturn {
  const result0 = useSingleRunPipeline({ variable: variables[0] || "", runId });
  const result1 = useSingleRunPipeline({ variable: variables[1] || "", runId });
  const result2 = useSingleRunPipeline({ variable: variables[2] || "", runId });
  const result3 = useSingleRunPipeline({ variable: variables[3] || "", runId });
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
